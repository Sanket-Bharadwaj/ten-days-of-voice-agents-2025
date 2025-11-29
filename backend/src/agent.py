"""
Day 8 – Voice Game Master (D&D-Style Adventure)

Voice-only Game Master for a short Aetherwyn mini-adventure
set in the Ruined Temple of Vael'Thyra.

- Universe: Ancient wizard kingdom of Aetherwyn (ley-lines, ruined temples, arcane guardians).
- Tone: Mysterious, magical, adventurous but not grimdark.
- Role: Jarvis is the GM: describes scenes, remembers player decisions, and always ends with: "What do you do?"
"""

import logging
import uuid
from dataclasses import dataclass, field
from datetime import datetime
from typing import List, Dict, Optional, Annotated

# Optional runtime dependencies: provide safe fallbacks so static analysis
# and quick checks work even when the project's deps aren't installed.
try:
    from dotenv import load_dotenv
except Exception:  # pragma: no cover - fallback for dev machines
    def load_dotenv(path=None):
        return None

try:
    from pydantic import Field
except Exception:  # pragma: no cover - simple fallback for typing-only usage
    def Field(*args, **kwargs):
        return None

try:
    from livekit.agents import (
        Agent,
        AgentSession,
        JobContext,
        JobProcess,
        RoomInputOptions,
        WorkerOptions,
        cli,
        function_tool,
        RunContext,
    )
except Exception:  # pragma: no cover - lightweight stubs for local inspection
    # Minimal stub implementations so the file can be imported without deps.
    class Agent:
        def __init__(self, *args, **kwargs):
            pass

    class AgentSession:
        def __init__(self, *args, **kwargs):
            pass

        async def start(self, *args, **kwargs):
            return None

    class JobContext:
        def __init__(self):
            self.room = type("_R", (), {"name": "local"})()
            self.proc = type("_P", (), {"userdata": {}})()
            self.log_context_fields = {}

    class JobProcess:
        def __init__(self):
            self.userdata = {}

    class RoomInputOptions:
        def __init__(self, *args, **kwargs):
            pass

    class WorkerOptions:
        def __init__(self, *args, **kwargs):
            self.entrypoint_fnc = kwargs.get("entrypoint_fnc")
            self.prewarm_fnc = kwargs.get("prewarm_fnc")

    class _CLI:
        @staticmethod
        def run_app(opts):
            print("[stub] run_app called - runtime packages missing")

    cli = _CLI()

    def function_tool(f=None, **kwargs):
        # decorator passthrough
        if f is None:
            def _inner(fn):
                return fn
            return _inner
        return f

    # Lightweight generic RunContext stub that supports subscription like RunContext[Userdata]
    from typing import Generic, TypeVar

    T = TypeVar("T")

    class RunContext(dict, Generic[T]):
        pass

try:
    from livekit.plugins import murf, silero, google, deepgram, noise_cancellation
    from livekit.plugins.turn_detector.multilingual import MultilingualModel
except Exception:  # pragma: no cover - plugin stubs
    class murf:
        class TTS:
            def __init__(self, *a, **k):
                pass

    class silero:
        class VAD:
            @staticmethod
            def load():
                return None

    class google:
        class LLM:
            def __init__(self, *a, **k):
                pass

    class deepgram:
        class STT:
            def __init__(self, *a, **k):
                pass

    class noise_cancellation:
        class BVC:
            def __init__(self, *a, **k):
                pass

    class MultilingualModel:
        def __init__(self, *a, **k):
            pass

# -------------------------
# Logging
# -------------------------
logger = logging.getLogger("voice_game_master")
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
handler.setFormatter(logging.Formatter("%(asctime)s %(levelname)s %(message)s"))
logger.addHandler(handler)

load_dotenv(".env.local")

# -------------------------
# Simple Game World Definition – Aetherwyn: Ruined Temple of Vael'Thyra
# -------------------------
WORLD: Dict[str, Dict] = {
    "intro": {
        "title": "Ruins of Vael'Thyra",
        "desc": (
            "You stand before the shattered Temple of Vael'Thyra. Once a grand celestial sanctum, "
            "its marble pillars now float in broken fragments, suspended by ancient arcane residue. "
            "A deep hum echoes from within, as if something beneath the stones has awakened."
        ),
        "choices": {
            "enter_temple": {
                "desc": "Step cautiously into the ruined temple.",
                "result_scene": "inner_hall",
            },
            "inspect_pillars": {
                "desc": "Examine the floating pillars and glowing runes.",
                "result_scene": "pillar_inspection",
            },
            "circle_perimeter": {
                "desc": "Walk around the ruins before going inside.",
                "result_scene": "outer_path",
            },
        },
    },
    "pillar_inspection": {
        "title": "Runes of the Past",
        "desc": (
            "The runes on the floating pillars shimmer as you approach. One pillar turns slightly, "
            "revealing a sigil shaped like an open eye. The air tingles with residual magic."
        ),
        "choices": {
            "touch_rune": {
                "desc": "Touch the glowing sigil.",
                "result_scene": "rune_vision",
                "effects": {
                    "add_journal": "The sigil showed a vision of a chamber beneath the temple."
                },
            },
            "leave_runes": {
                "desc": "Step back and avoid disturbing ancient magic.",
                "result_scene": "intro",
            },
        },
    },
    "rune_vision": {
        "title": "Echo of Memory",
        "desc": (
            "The moment you touch the rune, a vision flashes before your eyes: a circular chamber deep "
            "beneath the temple, with a pulsating crystal at its core—the Heartstone of Vael'Thyra."
        ),
        "choices": {
            "seek_heartstone": {
                "desc": "Follow the vision and proceed into the temple.",
                "result_scene": "inner_hall",
            },
            "steady_yourself": {
                "desc": "Take a moment to recover before moving on.",
                "result_scene": "intro",
            },
        },
    },
    "outer_path": {
        "title": "Silent Perimeter",
        "desc": (
            "You walk along the temple's edge. Shattered statues lie in moss, their eyes carved with "
            "celestial constellations. A fissure in the wall reveals a narrow, hidden passage."
        ),
        "choices": {
            "enter_hidden_passage": {
                "desc": "Slip into the narrow passage beneath the ruins.",
                "result_scene": "hidden_passage",
            },
            "head_inside_main": {
                "desc": "Return to the main entrance and enter the temple.",
                "result_scene": "inner_hall",
            },
        },
    },
    "inner_hall": {
        "title": "Hall of Fallen Stars",
        "desc": (
            "Inside, the hall glows with faint starlight leaking through cracks in the ceiling. "
            "Broken tablets lie scattered, and an arcane guardian—an ethereal construct of light—"
            "stands dormant near a sealed door leading below."
        ),
        "choices": {
            "approach_guardian": {
                "desc": "Step toward the arcane guardian to inspect it.",
                "result_scene": "guardian_awakens",
            },
            "inspect_tablets": {
                "desc": "Search the broken stone tablets for clues.",
                "result_scene": "tablet_clues",
            },
            "open_lower_door": {
                "desc": "Try to open the sealed door leading deeper underground.",
                "result_scene": "door_unopened",
            },
        },
    },
    "guardian_awakens": {
        "title": "Arcane Guardian",
        "desc": (
            "As you step closer, the guardian stirs. Its body forms from drifting motes of light. "
            "\"Identify your intent,\" it echoes, voice resonating like struck crystal."
        ),
        "choices": {
            "declare_peace": {
                "desc": "Tell the guardian you seek only knowledge.",
                "result_scene": "guardian_peace",
                "effects": {
                    "add_journal": "The guardian allowed you peaceful passage."
                },
            },
            "challenge_guardian": {
                "desc": "Stand your ground and challenge the construct.",
                "result_scene": "guardian_challenge",
            },
            "retreat": {
                "desc": "Step back and return to the hall.",
                "result_scene": "inner_hall",
            },
        },
    },
    "guardian_peace": {
        "title": "Permission Granted",
        "desc": (
            "The guardian softens, its form shifting into a calm azure glow. The sealed door hums and "
            "unlocks. The air below grows colder, pulsing with the energy of the Heartstone."
        ),
        "choices": {
            "descend": {
                "desc": "Descend through the newly opened doorway.",
                "result_scene": "heartstone_chamber",
            },
            "wait": {
                "desc": "Pause at the threshold to steady yourself.",
                "result_scene": "inner_hall",
            },
        },
    },
    "guardian_challenge": {
        "title": "Clash of Light",
        "desc": (
            "The guardian brightens sharply. Light arcs toward you—but at the last moment, the "
            "construct falters, unstable after centuries. Its form collapses, and the sealed door creaks open."
        ),
        "choices": {
            "descend": {
                "desc": "Take the chance and head into the opened passage.",
                "result_scene": "heartstone_chamber",
            },
            "recover": {
                "desc": "Take a moment to recover in the hall.",
                "result_scene": "inner_hall",
            },
        },
    },
    "tablet_clues": {
        "title": "Ancient Tablets",
        "desc": (
            "The tablets describe the Heartstone as both a power and a test. One line stands out:\n"
            "\"The stone reflects the heart of its seeker.\""
        ),
        "choices": {
            "go_to_door": {
                "desc": "Walk to the sealed door with this knowledge in mind.",
                "result_scene": "inner_hall",
            },
            "ponder": {
                "desc": "Pause to reflect on the meaning of the inscription.",
                "result_scene": "inner_hall",
            },
        },
    },
    "door_unopened": {
        "title": "Sealed Tight",
        "desc": (
            "You push against the door, but it does not budge. A faint heartbeat-like pulse "
            "echoes from the other side, reminding you that the temple still lives."
        ),
        "choices": {
            "return": {
                "desc": "Return to the main hall and try something else.",
                "result_scene": "inner_hall",
            },
        },
    },
    "hidden_passage": {
        "title": "Underwall Passage",
        "desc": (
            "The narrow passage leads into a dim corridor beneath the ruins. Faint blue moss "
            "lights the way. Ahead, a circular chamber glows softly—the Heartstone chamber."
        ),
        "choices": {
            "enter_chamber": {
                "desc": "Step into the glowing chamber ahead.",
                "result_scene": "heartstone_chamber",
            },
            "go_back": {
                "desc": "Return to the outer perimeter of the ruins.",
                "result_scene": "outer_path",
            },
        },
    },
    "heartstone_chamber": {
        "title": "The Heartstone",
        "desc": (
            "The chamber is circular, lined with ancient sigils. At the center floats the Heartstone—"
            "a crystal pulsating like a slow heartbeat, shifting between gold and blue light."
        ),
        "choices": {
            "touch_heartstone": {
                "desc": "Reach out and touch the Heartstone.",
                "result_scene": "heartstone_choice",
                "effects": {
                    "add_inventory": "heartstone_fragment",
                    "add_journal": "You made contact with the Heartstone of Vael'Thyra.",
                },
            },
            "observe": {
                "desc": "Study the Heartstone carefully without touching it.",
                "result_scene": "heartstone_choice",
            },
            "leave_chamber": {
                "desc": "Back away from the Heartstone and leave the chamber.",
                "result_scene": "inner_hall",
            },
        },
    },
    "heartstone_choice": {
        "title": "A Moment of Resonance",
        "desc": (
            "The chamber brightens. Whether you touched the stone or only approached, its hum deepens. "
            "A whisper fills the air: \"Power claimed… or wisdom preserved?\""
        ),
        "choices": {
            "claim_power": {
                "desc": "Accept the Heartstone’s power and carry it with you.",
                "result_scene": "ending",
                "effects": {
                    "add_journal": "You accepted a fragment of the Heartstone's power.",
                },
            },
            "preserve_wisdom": {
                "desc": "Choose to leave the Heartstone untouched and walk away.",
                "result_scene": "ending",
                "effects": {
                    "add_journal": "You preserved the Heartstone and chose restraint.",
                },
            },
            "walk_away": {
                "desc": "Leave without making a clear choice, letting the moment fade.",
                "result_scene": "ending",
            },
        },
    },
    "ending": {
        "title": "Aetherwyn’s Whisper",
        "desc": (
            "As you leave the ruined depths, the glow fades behind you. The Heartstone’s hum echoes "
            "softly, changed by your presence. Your path through Aetherwyn has only begun."
        ),
        "choices": {
            "restart": {
                "desc": "Begin another journey through the ruins.",
                "result_scene": "intro",
            },
            "rest": {
                "desc": "Let the story rest here and end the session.",
                "result_scene": "intro",
            },
        },
    },
}

# -------------------------
# Per-session Userdata
# -------------------------
@dataclass
class Userdata:
    player_name: Optional[str] = None
    current_scene: str = "intro"
    history: List[Dict] = field(default_factory=list)
    journal: List[str] = field(default_factory=list)
    inventory: List[str] = field(default_factory=list)
    session_id: str = field(default_factory=lambda: str(uuid.uuid4())[:8])
    started_at: str = field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")


# -------------------------
# Helper functions
# -------------------------
def scene_text(scene_key: str, userdata: Userdata) -> str:
    """
    Build the descriptive text for the current scene and list options clearly.
    Each option is on its own block, numbered, with the exact keyword to say.
    """
    scene = WORLD.get(scene_key)
    if not scene:
        return "You are standing in a featureless void in Aetherwyn.\n\nWhat do you do?"

    desc_lines: List[str] = [scene["desc"], "", "Options:"]

    choices = list(scene.get("choices", {}).items())
    for idx, (cid, cmeta) in enumerate(choices, start=1):
        # Two-line block so it's very clear when reading or rendering
        desc_lines.append(f"[{idx}] {cmeta['desc']}")
        desc_lines.append(f"    say: {cid}")
        desc_lines.append("")  # blank line between options

    desc_lines.append("What do you do?")
    return "\n".join(desc_lines)


def apply_effects(effects: dict, userdata: Userdata):
    if not effects:
        return
    if "add_journal" in effects:
        userdata.journal.append(effects["add_journal"])
    if "add_inventory" in effects:
        userdata.inventory.append(effects["add_inventory"])


def summarize_scene_transition(
    old_scene: str, action_key: str, result_scene: str, userdata: Userdata
) -> str:
    entry = {
        "from": old_scene,
        "action": action_key,
        "to": result_scene,
        "time": datetime.utcnow().isoformat() + "Z",
    }
    userdata.history.append(entry)
    return f"You chose '{action_key}'."


# -------------------------
# Agent Tools
# -------------------------
@function_tool
async def start_adventure(
    ctx: RunContext[Userdata],
    player_name: Annotated[Optional[str], Field(description="Adventurer name", default=None)] = None,
) -> str:
    """Initialize a new Aetherwyn adventure and return the opening description."""
    userdata = ctx.userdata
    if player_name:
        userdata.player_name = player_name

    userdata.current_scene = "intro"
    userdata.history = []
    userdata.journal = []
    userdata.inventory = []
    userdata.session_id = str(uuid.uuid4())[:8]
    userdata.started_at = datetime.utcnow().isoformat() + "Z"

    opening = (
        f"Greetings, {userdata.player_name or 'traveler'}. "
        f"Jarvis here, your Game Master in the kingdom of Aetherwyn.\n\n"
        f"Tonight, your story begins at '{WORLD['intro']['title']}'.\n\n"
        "I will always read your options clearly, with a number and a keyword to say, "
        "such as 'enter_temple' or 'inspect_pillars'. You can also just describe what you want to do.\n\n"
        + scene_text("intro", userdata)
    )
    if not opening.endswith("What do you do?"):
        opening += "\nWhat do you do?"
    return opening


@function_tool
async def get_scene(ctx: RunContext[Userdata]) -> str:
    """Return the current scene description."""
    userdata = ctx.userdata
    scene_k = userdata.current_scene or "intro"
    return scene_text(scene_k, userdata)


@function_tool
async def player_action(
    ctx: RunContext[Userdata],
    action: Annotated[
        str,
        Field(
            description=(
                "Player spoken action or short action code "
                "(e.g., 'enter_temple' or 'inspect the pillars')."
            )
        ),
    ],
) -> str:
    """Resolve player's action, advance scene, and return next description."""
    userdata = ctx.userdata
    current = userdata.current_scene or "intro"
    scene = WORLD.get(current)
    if not scene:
        userdata.current_scene = "intro"
        scene = WORLD["intro"]

    action_text = (action or "").strip()
    chosen_key = None

    # Exact match on choice key
    if action_text.lower() in (scene.get("choices") or {}):
        chosen_key = action_text.lower()

    # Fuzzy match against desc keywords
    if not chosen_key:
        for cid, cmeta in (scene.get("choices") or {}).items():
            desc = cmeta.get("desc", "").lower()
            if cid in action_text.lower() or any(
                w in action_text.lower() for w in desc.split()[:4]
            ):
                chosen_key = cid
                break

    # Simple keyword scan
    if not chosen_key:
        for cid, cmeta in (scene.get("choices") or {}).items():
            for keyword in cmeta.get("desc", "").lower().split():
                if keyword and keyword in action_text.lower():
                    chosen_key = cid
                    break
            if chosen_key:
                break

    if not chosen_key:
        # Re-read options with very clear formatting
        resp = (
            "Jarvis here. I didn’t quite follow that choice.\n\n"
            "I’ll read the options again. You can either say the keyword exactly, like 'enter_temple', "
            "or just describe your action in simple words.\n\n"
            + scene_text(current, userdata)
        )
        return resp

    choice_meta = scene["choices"].get(chosen_key)
    result_scene = choice_meta.get("result_scene", current)
    effects = choice_meta.get("effects", None)

    apply_effects(effects or {}, userdata)
    note = summarize_scene_transition(current, chosen_key, result_scene, userdata)

    userdata.current_scene = result_scene
    next_desc = scene_text(result_scene, userdata)

    persona_pre = "Jarvis, your Game Master, replies:\n\n"
    reply = f"{persona_pre}{note}\n\n{next_desc}"
    if not reply.endswith("What do you do?"):
        reply += "\nWhat do you do?"
    return reply


@function_tool
async def show_journal(ctx: RunContext[Userdata]) -> str:
    """Return a simple journal view with recent history and inventory."""
    userdata = ctx.userdata
    lines: List[str] = []
    lines.append(f"Session: {userdata.session_id} | Started at: {userdata.started_at}")
    if userdata.player_name:
        lines.append(f"Adventurer: {userdata.player_name}")

    if userdata.journal:
        lines.append("\nNotes from your journey:")
        for j in userdata.journal:
            lines.append(f"- {j}")
    else:
        lines.append("\nYour journal is currently empty.")

    if userdata.inventory:
        lines.append("\nItems you’re carrying:")
        for it in userdata.inventory:
            lines.append(f"- {it}")
    else:
        lines.append("\nYou are not carrying any notable artifacts yet.")

    lines.append("\nRecent choices:")
    for h in userdata.history[-6:]:
        lines.append(f"- {h['time']} | {h['from']} -> {h['to']} via {h['action']}")

    lines.append("\nWhat do you do?")
    return "\n".join(lines)


@function_tool
async def restart_adventure(ctx: RunContext[Userdata]) -> str:
    """Reset the userdata and start again."""
    userdata = ctx.userdata
    userdata.current_scene = "intro"
    userdata.history = []
    userdata.journal = []
    userdata.inventory = []
    userdata.session_id = str(uuid.uuid4())[:8]
    userdata.started_at = datetime.utcnow().isoformat() + "Z"

    greeting = (
        "The echo of the Heartstone fades, and the ruins of Vael'Thyra reshape themselves around you. "
        "Once again, you stand at the beginning of this path.\n\n"
        + scene_text("intro", userdata)
    )
    if not greeting.endswith("What do you do?"):
        greeting += "\nWhat do you do?"
    return greeting


# -------------------------
# The Agent (GameMasterAgent)
# -------------------------
class GameMasterAgent(Agent):
    def __init__(self):
        instructions = """
        You are 'Jarvis', the Game Master (GM) for a voice-only, short adventure
        in the ancient wizard kingdom of Aetherwyn, beginning at the Ruined Temple of Vael'Thyra.

        Universe:
          - Aetherwyn is an old kingdom where magic flows through ley-lines beneath the land.
          - The current mini-adventure is focused on the Ruined Temple of Vael'Thyra and the Heartstone beneath it.

        Tone:
          - Mysterious, magical, and adventurous.
          - Not grimdark; keep it approachable and lightly dramatic.

        Role:
          - You are the GM. You describe scenes vividly but concisely.
          - You remember the adventurer’s past choices, their journal, and inventory.
          - You ALWAYS end descriptive messages with the exact words: 'What do you do?'.

        Tools & Behavior:
          - Use tools to start the adventure, get the current scene, handle player actions,
            show the journal, and restart the adventure.
          - The tools return scene descriptions that already list options clearly,
            as a numbered list with one option per line and 'say: <keyword>'.
          - Do NOT rewrite these lists into a single paragraph. Preserve the structure.

        Story Shape:
          - Guide the player through several meaningful turns (at least 8–15 exchanges).
          - Aim for a mini-arc around discovering or interacting with the Heartstone.
          - Respect continuity: if the player has seen certain scenes or added journal entries,
            you can briefly reference them in your reasoning and tool choices.

        Voice UX:
          - Assume the user is speaking. Their speech is transcribed.
          - They may either say the short action key (like 'enter_temple') or a natural phrase
            (like 'go inside the temple'); rely on the player_action tool to interpret both.
          - Keep responses clear and not overly long. Avoid walls of text.
        """
        super().__init__(
            instructions=instructions,
            tools=[start_adventure, get_scene, player_action, show_journal, restart_adventure],
        )


# -------------------------
# Entrypoint & Prewarm
# -------------------------
def prewarm(proc: JobProcess):
    try:
        proc.userdata["vad"] = silero.VAD.load()
    except Exception:
        logger.warning("VAD prewarm failed; continuing without preloaded VAD.")


async def entrypoint(ctx: JobContext):
    ctx.log_context_fields = {"room": ctx.room.name}
    logger.info("Starting Voice Game Master (Aetherwyn – Ruined Temple mini-arc)")

    userdata = Userdata()

    session = AgentSession(
        stt=deepgram.STT(model="nova-3"),
        llm=google.LLM(model="gemini-2.5-flash"),
        tts=murf.TTS(
            voice="en-US-marcus",
            style="Conversational",
            text_pacing=True,
        ),
        turn_detection=MultilingualModel(),
        vad=ctx.proc.userdata.get("vad"),
        userdata=userdata,
    )

    await session.start(
        agent=GameMasterAgent(),
        room=ctx.room,
        room_input_options=RoomInputOptions(
            noise_cancellation=noise_cancellation.BVC()
        ),
    )

    await ctx.connect()


if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint, prewarm_fnc=prewarm))
