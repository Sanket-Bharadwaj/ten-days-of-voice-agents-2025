import json
import os
from typing import Annotated, Literal, Optional
from dataclasses import dataclass

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
    function_tool,
    RunContext,
)
from livekit.plugins import murf, silero, google, deepgram, noise_cancellation
from livekit.plugins.turn_detector.multilingual import MultilingualModel

load_dotenv(".env.local")

# =========================
# Knowledge Base
# =========================

CONTENT_FILE = "biology_content.json"

DEFAULT_CONTENT = [
    {
        "id": "dna",
        "title": "DNA",
        "summary": (
            "DNA (Deoxyribonucleic acid) is the molecule that carries genetic "
            "instructions for the development and functioning of living organisms. "
            "It is shaped like a double helix."
        ),
        "sample_question": "What is the full form of DNA and what is its structure called?",
    },
    {
        "id": "cell",
        "title": "The Cell",
        "summary": (
            "The cell is the basic structural, functional, and biological unit of all "
            "known organisms. It is often called the 'building block of life'. "
            "Organisms can be single-celled or multicellular."
        ),
        "sample_question": "What is the main difference between a Prokaryotic cell and a Eukaryotic cell?",
    },
    {
        "id": "nucleus",
        "title": "Nucleus",
        "summary": (
            "The nucleus is a membrane-bound organelle found in eukaryotic cells. "
            "It contains the cell's chromosomes (DNA) and controls the cell's growth and reproduction."
        ),
        "sample_question": "Why is the nucleus often referred to as the 'brain' or 'control center' of the cell?",
    },
    {
        "id": "cell_cycle",
        "title": "Cell Cycle",
        "summary": (
            "The cell cycle is a series of events that takes place in a cell as it grows and divides. "
            "It consists of Interphase (growth) and the Mitotic phase (division)."
        ),
        "sample_question": "In which phase of the cell cycle does the cell spend the most time?",
    },
]


def load_content():
    """Load biology content from JSON, generating it from DEFAULT_CONTENT if missing."""
    try:
        path = os.path.join(os.path.dirname(__file__), CONTENT_FILE)

        if not os.path.exists(path):
            with open(path, "w", encoding="utf-8") as f:
                json.dump(DEFAULT_CONTENT, f, indent=4)

        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)

    except Exception:
        return []


COURSE_CONTENT = load_content()

# =========================
# State Management
# =========================


@dataclass
class TutorState:
    current_topic_id: str | None = None
    current_topic_data: dict | None = None
    mode: Literal["learn", "quiz", "teach_back"] = "learn"

    def set_topic(self, topic_id: str):
        topic = next((item for item in COURSE_CONTENT if item["id"] == topic_id), None)
        if topic:
            self.current_topic_id = topic_id
            self.current_topic_data = topic
            return True
        return False


@dataclass
class Userdata:
    tutor_state: TutorState
    agent_session: Optional[AgentSession] = None


# =========================
# Tools
# =========================


@function_tool
async def select_topic(
    ctx: RunContext[Userdata],
    topic_id: Annotated[str, Field(description="The ID of the topic to study (e.g., 'dna', 'cell', 'nucleus')")],
) -> str:
    """Selects a topic to study from the available list."""
    state = ctx.userdata.tutor_state
    success = state.set_topic(topic_id.lower())

    if success:
        return (
            f"Topic set to {state.current_topic_data['title']}. "
            "Ask the user if they want to 'Learn', be 'Quizzed', or 'Teach it back'."
        )
    else:
        available = ", ".join([t["id"] for t in COURSE_CONTENT])
        return f"Topic not found. Available topics are: {available}"


@function_tool
async def set_learning_mode(
    ctx: RunContext[Userdata],
    mode: Annotated[str, Field(description="The mode to switch to: 'learn', 'quiz', or 'teach_back'")],
) -> str:
    """Switches the interaction mode and updates the agent's voice/persona."""

    state = ctx.userdata.tutor_state
    state.mode = mode.lower()
    agent_session = ctx.userdata.agent_session

    if agent_session and state.current_topic_data:
        if state.mode == "learn":
            agent_session.tts.update_options(voice="en-US-matthew", style="Promo")
            instruction = f"Mode: LEARN. Explain: {state.current_topic_data['summary']}"
        elif state.mode == "quiz":
            agent_session.tts.update_options(voice="en-US-alicia", style="Conversational")
            instruction = f"Mode: QUIZ. Ask this question: {state.current_topic_data['sample_question']}"
        elif state.mode == "teach_back":
            agent_session.tts.update_options(voice="en-US-ken", style="Promo")
            instruction = (
                "Mode: TEACH_BACK. Ask the user to explain the concept to you as if YOU are the beginner."
            )
        else:
            return "Invalid mode."
    else:
        instruction = "Voice switch failed (Session or topic not found)."

    return f"Switched to {state.mode} mode. {instruction}"


@function_tool
async def evaluate_teaching(
    ctx: RunContext[Userdata],
    user_explanation: Annotated[str, Field(description="The explanation given by the user during teach-back")],
) -> str:
    """Call this when the user has finished explaining a concept in 'teach_back' mode."""
    return (
        "Analyze the user's explanation. Give them a score out of 10 on accuracy and clarity, "
        "and correct any mistakes."
    )


# =========================
# Agent Definition
# =========================


class TutorAgent(Agent):
    def __init__(self):
        topic_list = ", ".join([f"{t['id']} ({t['title']})" for t in COURSE_CONTENT])

        super().__init__(
            instructions=f"""
            You are a Biology Tutor designed to help users master concepts like DNA and Cells.

            AVAILABLE TOPICS: {topic_list}

            YOU HAVE 3 MODES:
            1. LEARN Mode (Voice: Matthew): You explain the concept clearly using the summary data.
            2. QUIZ Mode (Voice: Alicia): You ask the user a specific question to test knowledge.
            3. TEACH_BACK Mode (Voice: Ken): You pretend to be a student and ask the user to explain.

            BEHAVIOR:
            - Start by asking what topic they want to study.
            - Use the `set_learning_mode` tool when the user asks to learn, take a quiz, or teach.
            - In 'teach_back' mode, listen to their explanation and then use `evaluate_teaching` to give feedback.
            """,
            tools=[select_topic, set_learning_mode, evaluate_teaching],
        )


# =========================
# Entrypoint
# =========================


def prewarm(proc: JobProcess):
    proc.userdata["vad"] = silero.VAD.load()


async def entrypoint(ctx: JobContext):
    ctx.log_context_fields = {"room": ctx.room.name}

    userdata = Userdata(tutor_state=TutorState())

    session = AgentSession(
        stt=deepgram.STT(model="nova-3"),
        llm=google.LLM(model="gemini-2.5-flash"),
        tts=murf.TTS(
            voice="en-US-matthew",
            style="Promo",
            text_pacing=True,
        ),
        turn_detection=MultilingualModel(),
        vad=ctx.proc.userdata["vad"],
        userdata=userdata,
    )

    userdata.agent_session = session

    await session.start(
        agent=TutorAgent(),
        room=ctx.room,
        room_input_options=RoomInputOptions(
            noise_cancellation=noise_cancellation.BVC(),
        ),
    )

    await ctx.connect()


if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint, prewarm_fnc=prewarm))
