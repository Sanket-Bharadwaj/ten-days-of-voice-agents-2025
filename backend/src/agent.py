import json
import os
from datetime import datetime
from typing import Annotated
from dataclasses import dataclass, field, asdict

from dotenv import load_dotenv
from pydantic import Field
from livekit.agents import (
    Agent,
    AgentSession,
    JobContext,
    JobProcess,
    RoomInputOptions,
    WorkerOptions,
    cli,
    RunContext,
    function_tool,
)

from livekit.plugins import murf, silero, google, deepgram, noise_cancellation
from livekit.plugins.turn_detector.multilingual import MultilingualModel

load_dotenv(".env.local")


# =========================
# State management
# =========================

@dataclass
class CheckInState:
    mood: str | None = None
    energy: str | None = None
    objectives: list[str] = field(default_factory=list)
    advice_given: str | None = None

    def is_complete(self) -> bool:
        return all([
            self.mood is not None,
            self.energy is not None,
            len(self.objectives) > 0,
        ])

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass
class Userdata:
    current_checkin: CheckInState
    history_summary: str
    session_start: datetime = field(default_factory=datetime.now)


# =========================
# Persistence
# =========================

WELLNESS_LOG_FILE = "wellness_log.json"


def get_log_path() -> str:
    base_dir = os.path.dirname(__file__)
    backend_dir = os.path.abspath(os.path.join(base_dir, ".."))
    return os.path.join(backend_dir, WELLNESS_LOG_FILE)


def load_history() -> list:
    path = get_log_path()
    if not os.path.exists(path):
        return []
    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
            return data if isinstance(data, list) else []
    except Exception as e:
        print(f"Could not load history: {e}")
        return []


def save_checkin_entry(entry: CheckInState) -> None:
    path = get_log_path()
    history = load_history()

    record = {
        "timestamp": datetime.now().isoformat(),
        "mood": entry.mood,
        "energy": entry.energy,
        "objectives": entry.objectives,
        "summary": entry.advice_given,
    }

    history.append(record)

    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(history, f, indent=4, ensure_ascii=False)

    print(f"Check-in saved to {path}")


# =========================
# Tools
# =========================

@function_tool
async def record_mood_and_energy(
    ctx: RunContext[Userdata],
    mood: Annotated[str, Field(description="The user's emotional state (e.g., happy, stressed, anxious)")],
    energy: Annotated[str, Field(description="The user's energy level (e.g., high, low, drained, energetic)")],
) -> str:
    """Record how the user is feeling."""
    ctx.userdata.current_checkin.mood = mood
    ctx.userdata.current_checkin.energy = energy

    print(f"Mood logged: {mood} | Energy: {energy}")

    return f"I've noted that you are feeling {mood} with {energy} energy."


@function_tool
async def record_objectives(
    ctx: RunContext[Userdata],
    objectives: Annotated[list[str], Field(description="List of 1-3 specific goals the user wants to achieve today")],
) -> str:
    """Record the user's daily goals."""
    ctx.userdata.current_checkin.objectives = objectives
    print(f"Objectives logged: {objectives}")
    return "I've written down your goals for the day."


@function_tool
async def complete_checkin(
    ctx: RunContext[Userdata],
    final_advice_summary: Annotated[str, Field(description="A brief 1-sentence summary of the advice given")],
) -> str:
    """Finalize the session, provide a recap, and save to JSON."""
    state = ctx.userdata.current_checkin
    state.advice_given = final_advice_summary

    if not state.is_complete():
        return "I can't finish yet. I still need your mood, energy, and at least one goal."

    save_checkin_entry(state)

    print("Wellness check-in completed.")
    print(f"Mood: {state.mood}")
    print(f"Energy: {state.energy}")
    print(f"Goals: {state.objectives}")

    recap = (
        "Here is your recap for today:\n"
        f"You are feeling {state.mood} and your energy is {state.energy}.\n"
        f"Your main goals are: {', '.join(state.objectives)}.\n\n"
        f"Remember: {final_advice_summary}\n\n"
        "I've saved this in your wellness log."
    )
    return recap


# =========================
# Agent definition
# =========================

class WellnessAgent(Agent):
    def __init__(self, history_context: str):
        super().__init__(
            instructions=f"""
You are a compassionate, supportive daily wellness companion.

CONTEXT FROM PREVIOUS SESSIONS:
{history_context}

GOALS FOR THIS SESSION:
1. Check in: Ask how they are feeling (mood) and their energy levels.
   - Reference the history context if available.
2. Intentions: Ask for 1–3 simple objectives for the day.
3. Support: Offer small, grounded, non-medical advice.
   - Example: suggest short breaks, light movement, or simple planning.
4. Recap & save: Summarize their mood and goals, then call 'complete_checkin'.

SAFETY:
- You are not a doctor or therapist.
- Do not diagnose conditions or prescribe treatments.
- If a user mentions self-harm or severe crisis, suggest professional help.
""",
            tools=[
                record_mood_and_energy,
                record_objectives,
                complete_checkin,
            ],
        )


# =========================
# Entrypoint
# =========================

def prewarm(proc: JobProcess):
    proc.userdata["vad"] = silero.VAD.load()


async def entrypoint(ctx: JobContext):
    ctx.log_context_fields = {"room": ctx.room.name}
    print("Starting wellness session")

    history = load_history()
    history_summary = "No previous history found. This is the first session."

    if history:
        last_entry = history[-1]
        history_summary = (
            f"Last check-in was on {last_entry.get('timestamp', 'unknown date')}. "
            f"User felt {last_entry.get('mood')} with {last_entry.get('energy')} energy. "
            f"Their goals were: {', '.join(last_entry.get('objectives', []))}."
        )
        print("History loaded:", history_summary)
    else:
        print("No history found.")

    userdata = Userdata(
        current_checkin=CheckInState(),
        history_summary=history_summary,
    )

    session = AgentSession(
        stt=deepgram.STT(model="nova-3"),
        llm=google.LLM(model="gemini-2.5-flash"),
        tts=murf.TTS(
            # Use a male voice id — change to your preferred Murf voice.
            voice="en-US-matthew",
            style="Conversation",
            text_pacing=True,
        ),
        turn_detection=MultilingualModel(),
        vad=ctx.proc.userdata["vad"],
        userdata=userdata,
    )

    await session.start(
        agent=WellnessAgent(history_context=history_summary),
        room=ctx.room,
        room_input_options=RoomInputOptions(
            noise_cancellation=noise_cancellation.BVC(),
        ),
    )

    await ctx.connect()


if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint, prewarm_fnc=prewarm))
