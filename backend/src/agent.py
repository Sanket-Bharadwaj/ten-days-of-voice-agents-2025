# ======================================================
# 💼 DAY 5: AI SALES DEVELOPMENT REP (SDR)
# 🏫 Horizon AI Academy – Lead Capture Agent
# 🚀 Features: FAQ Retrieval, Lead Qualification, JSON Database
# ======================================================

import json
import os
from datetime import datetime
from typing import Annotated, Optional
from dataclasses import dataclass, asdict

print("🚀 AI SDR AGENT INITIALIZED")
print("🏫 BRAND: Horizon AI Academy")


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

# ======================================================
# 📘 KNOWLEDGE BASE
# ======================================================

FAQ_FILE = "store_faq.json"
LEADS_FILE = "leads_db.json"

DEFAULT_FAQ = [
    {
        "question": "What does Horizon AI Academy offer?",
        "answer": "We provide premium online courses on Voice AI development, Python automation, and practical AI skills for creators, developers, and founders. We also offer code templates and starter kits to help learners build real-world AI projects faster."
    },
    {
        "question": "Who is the founder of Horizon AI Academy?",
        "answer": "Horizon AI Academy was founded by Sanket Bharadwaj, who leads the vision, product direction, and AI education content for the academy."
    },
    {
        "question": "What is the price of your Voice AI course?",
        "answer": "Our 'Professional Voice AI Developer' course is priced at $499 and includes LiveKit, Deepgram, Google Gemini, and TTS/STT agent workflows."
    },
    {
        "question": "Do you offer any free learning content?",
        "answer": "Yes! Horizon publishes weekly tutorials, open-source projects, and free starter templates to help beginners get started without cost."
    },
    {
        "question": "Do you offer consulting or custom AI agent development?",
        "answer": "Yes. We help startups and small teams build custom voice agents for sales, support, onboarding, and automation workflows. Pricing varies based on project scope."
    },
    {
        "question": "Do you provide certification?",
        "answer": "Yes, students who complete the premium courses receive an industry-recognized digital certificate from Horizon AI Academy."
    }
]


def load_knowledge_base() -> str:
    """Generates FAQ file if missing, then loads it."""
    try:
        path = os.path.join(os.path.dirname(__file__), FAQ_FILE)
        if not os.path.exists(path):
            with open(path, "w", encoding="utf-8") as f:
                json.dump(DEFAULT_FAQ, f, indent=4)
        with open(path, "r", encoding="utf-8") as f:
            return json.dumps(json.load(f))
    except Exception as e:
        print(f"⚠️ Error loading FAQ: {e}")
        return ""


def ensure_leads_file() -> str:
    """Creates leads_db.json if it does not exist and returns its path."""
    path = os.path.join(os.path.dirname(__file__), LEADS_FILE)
    if not os.path.exists(path):
        with open(path, "w", encoding="utf-8") as f:
            json.dump([], f, indent=4)
    return path


STORE_FAQ_TEXT = load_knowledge_base()

# ======================================================
# 🧾 LEAD PROFILE
# ======================================================

@dataclass
class LeadProfile:
    name: Optional[str] = None
    company: Optional[str] = None
    email: Optional[str] = None
    role: Optional[str] = None
    use_case: Optional[str] = None
    team_size: Optional[str] = None
    timeline: Optional[str] = None

    def is_complete(self) -> bool:
        return all(
            [
                self.name,
                self.company,
                self.email,
                self.role,
                self.use_case,
                self.team_size,
                self.timeline,
            ]
        )


@dataclass
class Userdata:
    lead_profile: LeadProfile


def get_next_missing_field(profile: LeadProfile) -> Optional[str]:
    """Return the next missing field in the lead capture flow."""
    if not profile.name:
        return "name"
    if not profile.company:
        return "company"
    if not profile.email:
        return "email"
    if not profile.role:
        return "role"
    if not profile.use_case:
        return "use_case"
    if not profile.team_size:
        return "team_size"
    if not profile.timeline:
        return "timeline"
    return None


FIELD_QUESTIONS = {
    "name": "To get started, may I know your name?",
    "company": "Great, and which company do you work at?",
    "email": "What's your email address so we can follow up?",
    "role": "What's your role at the company?",
    "use_case": "What would you like to build with Voice AI or automation?",
    "team_size": "How large is your team?",
    "timeline": "When would you like to get started?",
}

# ======================================================
# 🛠️ SDR TOOLS
# ======================================================


@function_tool
async def update_lead_profile(
    ctx: RunContext[Userdata],
    name: Annotated[Optional[str], Field(description="Customer's name")] = None,
    company: Annotated[Optional[str], Field(description="Customer's company")] = None,
    email: Annotated[Optional[str], Field(description="Customer's email")] = None,
    role: Annotated[Optional[str], Field(description="Customer's role/job title")] = None,
    use_case: Annotated[Optional[str], Field(description="What they want to build or learn")] = None,
    team_size: Annotated[Optional[str], Field(description="Team size as a string")] = None,
    timeline: Annotated[Optional[str], Field(description="Timeline for starting")] = None,
) -> str:
    """
    Update the lead profile with any fields the user provided,
    then return the next question (only ONE field at a time).
    """
    profile = ctx.userdata.lead_profile

    if name:
        profile.name = name
    if company:
        profile.company = company
    if email:
        profile.email = email
    if role:
        profile.role = role
    if use_case:
        profile.use_case = use_case
    if team_size:
        profile.team_size = team_size
    if timeline:
        profile.timeline = timeline

    print(f"📝 Lead updated: {profile}")

    # If everything is filled, tell the agent to save
    if profile.is_complete():
        return (
            "All the required details are collected. "
            "Now call submit_lead_and_end to save the lead and close the conversation."
        )

    # Ask only the next missing field
    next_field = get_next_missing_field(profile)
    if next_field is None:
        return (
            "All the required details are collected. "
            "Now call submit_lead_and_end to save the lead and close the conversation."
        )

    return FIELD_QUESTIONS[next_field]


@function_tool
async def submit_lead_and_end(ctx: RunContext[Userdata]) -> str:
    """
    Save the lead to leads_db.json (creating it if needed),
    then give a friendly closing message.
    """
    profile = ctx.userdata.lead_profile
    db_path = ensure_leads_file()

    entry = asdict(profile)
    entry["timestamp"] = datetime.now().isoformat()

    try:
        with open(db_path, "r", encoding="utf-8") as f:
            leads = json.load(f)
    except Exception:
        leads = []

    leads.append(entry)

    with open(db_path, "w", encoding="utf-8") as f:
        json.dump(leads, f, indent=4)

    print("✅ Lead saved to leads_db.json")
    return (
        f"Thanks {profile.name}! I’ve saved your details about "
        f"\"{profile.use_case}\". We'll reach out to you at {profile.email} soon. Goodbye!"
    )

# ======================================================
# 🤖 SDR AGENT
# ======================================================


class SDRAgent(Agent):
    def __init__(self):
        super().__init__(
            instructions=f"""
You are 'Jarvis', the Sales Development Rep (SDR) for Horizon AI Academy.

Your goals:
- Answer questions about Horizon's courses, templates, and consulting using the FAQ.
- Collect lead details in this exact order, ONE AT A TIME:
  1. name
  2. company
  3. email
  4. role
  5. use_case
  6. team_size
  7. timeline

Rules:
- Ask for ONE field, wait for the user's reply.
- When the user replies with any lead info, call update_lead_profile with those fields.
- After update_lead_profile returns, speak its message to the user (usually the next question).
- Never ask for multiple fields in a single question.
- When update_lead_profile tells you that all details are collected, call submit_lead_and_end.
- Be friendly and conversational, not robotic.

FAQ (knowledge base):
{STORE_FAQ_TEXT}

If you don't know something (e.g., a price that’s not in the FAQ), say:
"I'll check with the Horizon team and email you." Do NOT make up numbers.
""",
            tools=[update_lead_profile, submit_lead_and_end],
        )

# ======================================================
# 🎬 ENTRYPOINT
# ======================================================


def prewarm(proc: JobProcess):
    proc.userdata["vad"] = silero.VAD.load()


async def entrypoint(ctx: JobContext):
    ctx.log_context_fields = {"room": ctx.room.name}

    print("\n💼 STARTING HORIZON SDR SESSION")

    # Initialize per-call state
    userdata = Userdata(lead_profile=LeadProfile())

    session = AgentSession(
        stt=deepgram.STT(model="nova-3"),
        llm=google.LLM(model="gemini-2.5-flash"),
        tts=murf.TTS(
            # Use a male Murf Falcon voice for the agent
            voice="en-US-matthew",
            style="Conversation",
            text_pacing=True,
        ),
        turn_detection=MultilingualModel(),
        vad=ctx.proc.userdata["vad"],
        userdata=userdata,
    )

    await session.start(
        agent=SDRAgent(),
        room=ctx.room,
        room_input_options=RoomInputOptions(
            noise_cancellation=noise_cancellation.BVC()
        ),
    )

    await ctx.connect()


if __name__ == "__main__":
    cli.run_app(
        WorkerOptions(
            entrypoint_fnc=entrypoint,
            prewarm_fnc=prewarm,
        )
    )
