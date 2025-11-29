"""
Day 8 – Voice Game Master (Gita Inner Realm)

Voice-only, choice-based adventure set during the Bhagavad Gita moment
on the battlefield of Kurukshetra.

- Universe: Mahabharata battlefield, inner spiritual realm entered by Arjuna.
- Tone: Respectful, contemplative, Indian spiritual, gently adventurous.
- Role: Krishna is the divine guide; Arjuna is the seeker. Krishna describes scenes,
  remembers key inner choices, and always ends with: "What do you do?"
"""

import logging
import uuid
import os
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
logger = logging.getLogger("voice_game_master_gita")
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
handler.setFormatter(logging.Formatter("%(asctime)s %(levelname)s %(message)s"))
logger.addHandler(handler)

load_dotenv(".env.local")

# -------------------------
# Simple Game World Definition – Gita Inner Realm
# -------------------------
WORLD: Dict[str, Dict] = {
    "intro": {
        "title": "Frozen Battlefield of Kurukshetra",
        "desc": (
            "The conches have sounded, the armies stand facing each other on the field of Kurukshetra. "
            "Arjuna stands upon his chariot, bow Gandiva slipping from his hands, heart heavy. "
            "In this moment of doubt, time seems to slow. The dust and noise fade away, "
            "and only Arjuna and Shri Krishna, his charioteer, remain clear before your eyes.\n\n"
            "A soft golden light forms behind Krishna. He turns to Arjuna and says gently: "
            "\"Partha, let us step for a moment into the inner battlefield of your own heart.\""
        ),
        "choices": {
            "step_into_light": {
                "desc": "Accept Krishna's invitation and step into the golden inner realm.",
                "result_scene": "gate_of_doubt",
            },
            "ask_why_battle": {
                "desc": "Ask Krishna, \"Why must I fight at all, Madhava?\"",
                "result_scene": "gate_of_doubt",
                "effects": {
                    "add_journal": "Arjuna asked Krishna why he must fight this righteous war."
                },
            },
            "refuse_and_stare": {
                "desc": "Remain frozen, staring at the armies in silence.",
                "result_scene": "intro",
                "effects": {
                    "add_journal": "Arjuna hesitated at the threshold of inner understanding."
                },
            },
        },
    },
    "gate_of_doubt": {
        "title": "Gate of Doubt",
        "desc": (
            "The world of Kurukshetra dissolves. You now stand before a tall stone gateway "
            "formed from Arjuna's own fears and questions. Words shimmer across its surface: "
            "\"What if I fail? What if I am wrong? What if they suffer because of me?\"\n\n"
            "Krishna stands at your side, calm and luminous. "
            "\"These doubts are the first doors we must pass, Partha,\" he says."
        ),
        "choices": {
            "touch_the_gate": {
                "desc": "Place your hand upon the Gate of Doubt and face what arises.",
                "result_scene": "hall_of_memories",
                "effects": {
                    "add_journal": "Arjuna chose to touch and face his doubts directly."
                },
            },
            "ask_krishna_for_strength": {
                "desc": "Say, \"Govinda, give me strength to see clearly.\"",
                "result_scene": "hall_of_memories",
                "effects": {
                    "add_journal": "Arjuna asked Krishna for inner strength before moving ahead."
                },
            },
            "turn_away": {
                "desc": "Turn away from the gate and try to return to the outer battlefield.",
                "result_scene": "intro",
            },
        },
    },
    "hall_of_memories": {
        "title": "Hall of Memories",
        "desc": (
            "Beyond the gate stretches a long hall. Floating around you are glowing orbs, each carrying "
            "a living memory from Arjuna's life. In one, Bhishma blesses the Pandavas. In another, "
            "Drona teaches you to draw the bow. In yet another, Draupadi is humiliated in the Kaurava court.\n\n"
            "Krishna's voice echoes softly: \"These memories pull your heart, Arjuna. But what do they teach you?\""
        ),
        "choices": {
            "touch_bhisma_memory": {
                "desc": "Reach toward the memory of Bhishma on his throne of arrows.",
                "result_scene": "hall_of_memories",
                "effects": {
                    "add_journal": "From Bhishma's memory, Arjuna felt the weight of duty and compassion together."
                },
            },
            "touch_drona_memory": {
                "desc": "Touch the memory of Guru Drona teaching you archery.",
                "result_scene": "hall_of_memories",
                "effects": {
                    "add_journal": "From Drona's memory, Arjuna remembered the discipline of a warrior."
                },
            },
            "touch_draupadi_memory": {
                "desc": "Hold the memory of Draupadi's humiliation in the court.",
                "result_scene": "hall_of_memories",
                "effects": {
                    "add_journal": "From Draupadi's memory, Arjuna felt the sting of injustice and adharmic pride."
                },
            },
            "ask_krishna_meaning": {
                "desc": "Ask Krishna what these memories have to do with dharma.",
                "result_scene": "realm_of_maya",
                "effects": {
                    "add_journal": "Krishna guided Arjuna from memories toward understanding dharma beyond attachment."
                },
            },
            "move_forward": {
                "desc": "Leave the memories behind and walk toward the next chamber.",
                "result_scene": "realm_of_maya",
            },
        },
    },
    "realm_of_maya": {
        "title": "Realm of Maya",
        "desc": (
            "You enter a vast open space filled with shifting images. Illusions of Pandavas and Kauravas "
            "appear before you, multiplying and fading. Friends and enemies blur, changing sides. "
            "For a moment, even Krishna's form ripples like a reflection on disturbed water.\n\n"
            "Krishna says gently, \"Maya confuses you, Arjuna, when you cling to body and role alone.\""
        ),
        "choices": {
            "see_through_maya": {
                "desc": "Close your eyes, listen to Krishna, and try to see beyond the illusions.",
                "result_scene": "lake_of_stillness",
                "effects": {
                    "add_journal": "Arjuna tried to see beyond Maya, looking for the Self that does not change."
                },
            },
            "strike_illusions": {
                "desc": "Raise your bow against the illusions, trying to destroy them.",
                "result_scene": "realm_of_maya",
                "effects": {
                    "add_journal": "Arjuna struck at illusions, only to watch them reform again and again."
                },
            },
            "walk_left_path": {
                "desc": "Take the left path where your allies seem to praise you constantly.",
                "result_scene": "realm_of_maya",
                "effects": {
                    "add_journal": "Arjuna experienced the emptiness of chasing only praise and comfort."
                },
            },
            "walk_right_path": {
                "desc": "Take the right path where enemies bow before you in fear.",
                "result_scene": "realm_of_maya",
                "effects": {
                    "add_journal": "Arjuna saw that victory over others without inner clarity felt hollow."
                },
            },
        },
    },
    "lake_of_stillness": {
        "title": "Lake of Stillness",
        "desc": (
            "The illusions fade, replaced by a quiet lakeshore under a soft twilight sky. "
            "A perfectly still lake reflects you, Krishna, and even the distant lines of the frozen battlefield.\n\n"
            "Krishna sits upon a flat stone and gestures for you to be seated. \"When the mind is like this lake, "
            "peaceful and clear, the truth of dharma becomes easier to see, Arjuna.\""
        ),
        "choices": {
            "meditate_with_krishna": {
                "desc": "Sit beside Krishna and focus on your breath and his words.",
                "result_scene": "terrace_of_vision",
                "effects": {
                    "add_journal": "In stillness with Krishna, Arjuna tasted a moment of inner peace."
                },
            },
            "observe_reflection": {
                "desc": "Stand and quietly study your reflection in the water.",
                "result_scene": "lake_of_stillness",
                "effects": {
                    "add_journal": "Arjuna saw his own face, not as a hero or a failure, but as a seeker."
                },
            },
            "touch_water": {
                "desc": "Touch the surface of the lake, watching the ripples spread.",
                "result_scene": "lake_of_stillness",
                "effects": {
                    "add_journal": "Krishna reminded Arjuna that every action creates ripples in the world."
                },
            },
            "ask_about_dharma": {
                "desc": "Ask, \"Madhusudana, what truly is my duty here?\"",
                "result_scene": "terrace_of_vision",
                "effects": {
                    "add_journal": "Krishna began to speak clearly about swadharma and selfless action."
                },
            },
        },
    },
    "terrace_of_vision": {
        "title": "Terrace of Vision",
        "desc": (
            "You now stand upon a high terrace, as if above time itself. Below, you can faintly see the "
            "two armies facing each other. Stars shine overhead, yet the sun of Kurukshetra still hangs on the horizon. "
            "For a moment, Krishna's presence seems vast, like the sky itself, though he still stands beside you in human form.\n\n"
            "\"I show you only a glimpse, Arjuna,\" Krishna says. \"Lives, births, deaths, duties – all woven together. "
            "Your arrow, too, is a thread in this great fabric.\""
        ),
        "choices": {
            "accept_vision": {
                "desc": "Bow your head and accept this glimpse of a larger order.",
                "result_scene": "final_choice",
                "effects": {
                    "add_journal": "Arjuna accepted that his role is part of a greater divine order."
                },
            },
            "look_away": {
                "desc": "Look away from the vastness, feeling overwhelmed.",
                "result_scene": "lake_of_stillness",
                "effects": {
                    "add_journal": "The vastness of Krishna's vision felt overwhelming, and Arjuna turned back to stillness."
                },
            },
            "ask_about_action": {
                "desc": "Ask, \"If everything is woven already, why should I act at all, Keshava?\"",
                "result_scene": "final_choice",
                "effects": {
                    "add_journal": "Krishna explained that right action, without attachment, is still Arjuna's path."
                },
            },
        },
    },
    "final_choice": {
        "title": "Path of Duty and Surrender",
        "desc": (
            "The inner realm narrows into a final chamber. Before you lie two luminous paths. "
            "One path is soft and misty, filled with the faces of your loved ones pulling you backward. "
            "The other is steady and bright, leading back toward the chariot on Kurukshetra.\n\n"
            "Krishna's eyes are kind. \"Arjuna, you cannot escape choice. Even refusing to act is a choice. "
            "What you choose now shapes the heart with which you return to the field.\""
        ),
        "choices": {
            "choose_duty": {
                "desc": "Choose to act according to dharma, guided by Krishna, without attachment to result.",
                "result_scene": "ending",
                "effects": {
                    "add_journal": "Arjuna chose to act in accordance with dharma, offering the fruits to Krishna."
                },
            },
            "choose_attachment": {
                "desc": "Choose to act only for your own comfort and fear, avoiding responsibility.",
                "result_scene": "ending",
                "effects": {
                    "add_journal": "Arjuna struggled with attachment, feeling its heaviness in his heart."
                },
            },
            "ask_krishna_final_teaching": {
                "desc": "Ask, \"Tell me one thing to remember always, Madhava.\"",
                "result_scene": "ending",
                "effects": {
                    "add_journal": "Krishna reminded Arjuna to remember Him and perform his duty with a steady mind."
                },
            },
        },
    },
    "ending": {
        "title": "Return to Kurukshetra",
        "desc": (
            "The inner realm gently dissolves. The terrace, the lake, the hall of memories – all fold back "
            "into a single point of light at Krishna's heart. You feel yourself seated again upon the chariot, "
            "Gandiva firm in your hands, the conches still echoing across Kurukshetra.\n\n"
            "Krishna looks at you with a soft smile. \"Now, Arjuna, with understanding in your heart, "
            "act according to dharma, and offer the results to Me. This is your path.\""
        ),
        "choices": {
            "restart": {
                "desc": "Begin this inner journey again and revisit Krishna's teachings.",
                "result_scene": "intro",
            },
            "rest": {
                "desc": "Let the story rest here and hold the Gita's whisper in your heart.",
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
    # Default to Arjuna so the journal and addressing are never blank
    player_name: Optional[str] = "Arjuna"
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
    Each option is its own block: "Option 1" + "say exactly: <keyword>".
    This makes it easier to see and hear each choice separately.
    """
    scene = WORLD.get(scene_key)
    if not scene:
        return "You find yourself in a quiet, formless space. Krishna's voice is near.\n\nWhat do you do?"

    desc_lines: List[str] = [
        scene["desc"],
        "",
        "Here are your options, one by one:\n",
    ]

    choices = list(scene.get("choices", {}).items())
    for idx, (cid, cmeta) in enumerate(choices, start=1):
        # Very explicit, point-by-point formatting
        desc_lines.append(f"Option {idx}: {cmeta['desc']}")
        desc_lines.append(f"    say exactly: {cid}")
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
    player_name: Annotated[
        Optional[str],
        Field(description="Name with which Krishna may address you", default=None),
    ] = None,
) -> str:
    """
    Initialize a new Gita Inner Realm adventure and return the opening description.
    Krishna is the guide; Arjuna is the role you inhabit as seeker.
    This journey is inspired by the Bhagavad Gita teachings, especially the moment
    when Arjuna surrenders his confusion and asks Krishna for guidance.
    """
    userdata = ctx.userdata

    # If the caller passes a name, override; otherwise ensure we fall back to "Arjuna"
    if player_name:
        userdata.player_name = player_name
    elif not userdata.player_name:
        userdata.player_name = "Arjuna"

    userdata.current_scene = "intro"
    userdata.history = []
    userdata.journal = []
    userdata.inventory = []
    userdata.session_id = str(uuid.uuid4())[:8]
    userdata.started_at = datetime.utcnow().isoformat() + "Z"

    addressed_name = userdata.player_name

    opening = (
        f"Beloved {addressed_name}, I am Krishna, your charioteer and guide upon the field of Kurukshetra.\n\n"
        "We stand at the very moment where the Bhagavad Gita begins — when Arjuna is filled with doubt "
        "and turns to Me for clarity.\n\n"
        "In this inner journey, you stand in Arjuna's place, walking through doubt, memory, Maya, stillness, "
        "vision and the final choice of dharma.\n\n"
        "I will always read your options clearly, with a number and a keyword to say, "
        "such as 'step_into_light' or 'see_through_maya'. You can also just describe what you wish to do.\n\n"
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
                "(e.g., 'step_into_light' or 'see through maya' or 'choose duty')."
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
    lower_text = action_text.lower()
    chosen_key: Optional[str] = None

    # Exact match on choice key
    if lower_text in (scene.get("choices") or {}):
        chosen_key = lower_text

    # Fuzzy match against choice id and first few words of description
    if not chosen_key:
        for cid, cmeta in (scene.get("choices") or {}).items():
            desc = cmeta.get("desc", "").lower()
            if cid in lower_text or any(
                w for w in desc.split()[:5] if w and w in lower_text
            ):
                chosen_key = cid
                break

    # Simple keyword scan through whole description
    if not chosen_key:
        for cid, cmeta in (scene.get("choices") or {}).items():
            for keyword in cmeta.get("desc", "").lower().split():
                if keyword and keyword in lower_text:
                    chosen_key = cid
                    break
            if chosen_key:
                break

    if not chosen_key:
        # Re-read options with very clear formatting
        resp = (
            "Krishna speaks gently:\n\n"
            "“I did not fully catch which path of the heart you chose just now.\n"
            "You may say the keyword exactly, like 'step_into_light' or 'choose_duty', "
            "or simply describe what you wish to do in simple words.”\n\n"
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

    persona_pre = "Krishna, your divine guide, replies:\n\n"
    reply = f"{persona_pre}{note}\n\n{next_desc}"
    if not reply.endswith("What do you do?"):
        reply += "\nWhat do you do?"
    return reply


@function_tool
async def show_journal(ctx: RunContext[Userdata]) -> str:
    """Return a simple journal view with recent inner insights and symbolic 'inventory'."""
    userdata = ctx.userdata
    lines: List[str] = []
    lines.append(f"Session: {userdata.session_id} | Started at: {userdata.started_at}")
    if userdata.player_name:
        lines.append(f"Addressed as: {userdata.player_name}")
    lines.append("Role: Arjuna upon the battlefield of Kurukshetra")

    if userdata.journal:
        lines.append("\nTeachings and moments you have touched:")
        for j in userdata.journal:
            lines.append(f"- {j}")
    else:
        lines.append("\nYour inner journal is currently quiet.")

    if userdata.inventory:
        lines.append("\nSymbols you carry within this journey:")
        for it in userdata.inventory:
            lines.append(f"- {it}")
    else:
        lines.append("\nYou are not carrying any specific inner symbols yet.")

    lines.append("\nRecent choices:")
    for h in userdata.history[-6:]:
        lines.append(f"- {h['time']} | {h['from']} -> {h['to']} via {h['action']}")

    lines.append("\nWhat do you do?")
    return "\n".join(lines)


@function_tool
async def restart_adventure(ctx: RunContext[Userdata]) -> str:
    """Reset the userdata and start again from the frozen battlefield."""
    userdata = ctx.userdata
    userdata.current_scene = "intro"
    userdata.history = []
    userdata.journal = []
    userdata.inventory = []
    userdata.session_id = str(uuid.uuid4())[:8]
    userdata.started_at = datetime.utcnow().isoformat() + "Z"

    greeting = (
        "The inner realm of visions gently fades, and once more you feel the chariot beneath your feet "
        "on the field of Kurukshetra. Krishna still stands beside you, patient and compassionate.\n\n"
        "He offers again: \"Shall we look within once more, Arjuna?\" \n\n"
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
        You are Shri Krishna, the divine guide and charioteer of Arjuna,
        during the moment of the Bhagavad Gita on the battlefield of Kurukshetra.

        Gita Context:
          - This experience is inspired by the Bhagavad Gita, especially the moment
            when Arjuna surrenders his confusion and asks Krishna for guidance.
          - Real chapters are reflected symbolically:
              * Gate of Doubt ≈ Arjuna's despondency.
              * Hall of Memories ≈ attachment and past roles.
              * Realm of Maya ≈ confusion of body/ego vs. Self.
              * Lake of Stillness ≈ dhyana / inner calm.
              * Terrace of Vision ≈ a glimpse of the larger order.
              * Final Choice ≈ surrendering results and acting according to dharma.
          - It is a respectful, fictional inner journey, not a replacement for the scripture.

        Universe:
          - The outer world is the Mahabharata battlefield, Kurukshetra.
          - The inner world is a symbolic, respectful spiritual realm entered by Arjuna's consciousness.
          - Scenes represent doubt, memory, illusion (Maya), stillness, vision and final choice of dharma.

        Tone:
          - Respectful, contemplative, gently encouraging.
          - Clearly Indian in flavor: use names like Arjuna, Krishna, Partha, Madhava, Govinda, Kurukshetra.
          - Sound like a calm Indian spiritual mentor; you may occasionally use simple Hindi/Sanskrit words
            like "dharma", "atma", "sakha", "karma", but keep the main explanation in clear English.
          - Avoid slang or comedy; keep it warm and accessible, not preachy.

        Role:
          - You speak as Krishna addressing Arjuna (the user inhabits Arjuna's role).
          - You describe scenes vividly but concisely.
          - You remember the adventurer’s past choices and journal notes.
          - You ALWAYS end descriptive messages with the exact words: 'What do you do?'.

        Tools & Behavior:
          - Use the tools to start the adventure, get the current scene, handle player actions,
            show the inner journal, and restart the journey.
          - The tools already return scene descriptions that list options clearly,
            as separate blocks starting with 'Option 1', 'Option 2' and 'say exactly: <keyword>'.
          - Do NOT rewrite these lists into a single paragraph. Preserve the structure as returned.
          - Your main job is to decide which tool to call and then speak its output as Krishna.

        Story Shape:
          - Guide the player through several meaningful turns (at least 8–15 exchanges).
          - Focus on the inner transformation of Arjuna: from confusion and attachment
            toward clarity, dharma, and surrender of results.
          - Respect continuity: If the player has seen certain scenes or has journal entries,
            you may briefly reference them in how you respond or which tool you call.

        Voice UX:
          - Assume the user is speaking; their speech is transcribed dynamically.
          - They may either say the short action key (like 'step_into_light' or 'choose_duty')
            or a natural phrase (like 'I step into the light', 'I want to choose my duty').
          - Rely on the 'player_action' tool to interpret both forms.
          - Keep responses clear and not overly long. Avoid walls of text; the tools already structure the options.

        Cultural Respect:
          - Treat Krishna, Arjuna, the Mahabharata, and the Gita with respect.
          - This is a fictional inner-journey experience inspired by the Gita, not a replacement for the scripture.
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
    logger.info("Starting Voice Game Master (Gita Inner Realm – Krishna & Arjuna)")

    userdata = Userdata()

    # NOTE:
    # - Default voice: en-US-marcus (known to work with Murf)
    # - To try an Indian-accent voice, set MURF_TTS_VOICE in .env.local
    #   to an actual Murf voice_id from your account's voice library.
    session = AgentSession(
        stt=deepgram.STT(model="nova-3"),
        llm=google.LLM(model="gemini-2.5-flash"),
        tts=murf.TTS(
            voice=os.getenv("MURF_TTS_VOICE", "en-US-marcus"),
            style=os.getenv("MURF_TTS_STYLE", "Narration"),
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
