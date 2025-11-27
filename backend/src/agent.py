# ======================================================
# 🏦 DAY 6: BANK FRAUD ALERT AGENT (SQLite DB)
# 🛡️ HDFC Bank - Fraud Detection & Resolution
# ======================================================

from dataclasses import dataclass
from datetime import datetime
from typing import Annotated, Optional

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

from database import FraudCase, db  # local DB module

print("🚀 Bank Fraud Agent (SQLite) initialized for HDFC Bank.")

load_dotenv(".env.local")

# ======================================================
# 💾 SEED SAMPLE CASES (if DB empty)
# ======================================================

def seed_sample_cases() -> None:
    existing = db.get_all_fraud_cases()
    if existing:
        return

    case1 = FraudCase(
        id="case_sanket_1",
        userName="Sanket",
        securityIdentifier="45291",
        cardEnding="2891",
        cardType="VISA Credit",
        transactionName="Amazon India",
        transactionAmount="₹38,499.00",
        transactionTime="1:45 AM IST",
        transactionLocation="Bengaluru, India",
        transactionCategory="Online Shopping",
        transactionSource="amazon.in",
        status="pending",
        securityQuestion="What is your favorite color?",
        securityAnswer="blue",
        createdAt=datetime.now().isoformat(),
        outcome="pending",
        outcomeNote="Automated flag: High-value purchase made at unusual hours.",
    )

    case2 = FraudCase(
        id="case_sradha_1",
        userName="Sradha",
        securityIdentifier="90311",
        cardEnding="7742",
        cardType="Mastercard Debit",
        transactionName="Quick Eats Restaurant",
        transactionAmount="₹1,92,000.00",
        transactionTime="3:20 AM IST",
        transactionLocation="Mumbai, India",
        transactionCategory="Restaurant",
        transactionSource="in-store_card_present",
        status="pending",
        securityQuestion="What city were you born in?",
        securityAnswer="mumbai",
        createdAt=datetime.now().isoformat(),
        outcome="pending",
        outcomeNote="Automated flag: Unusually large restaurant transaction at late night hours.",
    )

    db.add_fraud_case(case1)
    db.add_fraud_case(case2)

seed_sample_cases()

# ======================================================
# 🧠 STATE MANAGEMENT
# ======================================================

@dataclass
class Userdata:
    active_case: Optional[FraudCase] = None

# ======================================================
# 🛠️ TOOLS
# ======================================================

@function_tool
async def lookup_customer(
    ctx: RunContext[Userdata],
    name: Annotated[str, Field(description="Customer's first name")],
) -> str:
    """
    Lookup a customer in the fraud database by first name.
    After this, the agent must verify the security identifier
    before revealing transaction details.
    """
    case = db.get_fraud_case_by_name(name)
    if not case:
        return (
            "I couldn’t find any HDFC Bank security alerts under that name. "
            "Please repeat your first name, or check if the cardholder name is different."
        )

    ctx.userdata.active_case = case

    return (
        "I’ve located a recent security alert on your HDFC Bank card. "
        f"Before I can proceed, please confirm your security identifier. "
        f"It should end with the digits {case.securityIdentifier[-2:]}."
    )


@function_tool
async def describe_active_transaction(
    ctx: RunContext[Userdata],
) -> str:
    """
    Return a precise, ready-to-speak description of the currently active transaction.
    The agent must read this response as-is, without changing the merchant name or amount.
    """
    case = ctx.userdata.active_case
    if not case:
        return "There is no active fraud case loaded for this call."

    parts = [
        f"The flagged transaction on your HDFC Bank card is for {case.transactionAmount}.",
        f"It is recorded at a merchant called \"{case.transactionName}\".",
        f"The time of the transaction is {case.transactionTime}.",
    ]

    if case.transactionLocation:
        parts.append(f"The location on file is {case.transactionLocation}.")

    return " ".join(parts)


@function_tool
async def resolve_fraud_case(
    ctx: RunContext[Userdata],
    status: Annotated[str, Field(description="'confirmed_safe' or 'confirmed_fraud'")],
    notes: Annotated[str, Field(description="Short notes about what the customer said")],
) -> str:
    """
    Update the case as confirmed safe or confirmed fraud and return a closing message.
    """
    case = ctx.userdata.active_case
    if not case:
        return "There is no active fraud case selected. Please look up the customer first."

    outcome = status

    updated = db.update_fraud_case_status(
        case_id=case.id,
        status=status,
        outcome=outcome,
        note=notes,
    )

    if not updated:
        return (
            "There was an error updating your case in the HDFC Bank system. "
            "Please contact customer support using the number on the back of your card."
        )

    if status == "confirmed_fraud":
        return (
            f"Thank you for confirming. I’ve marked this transaction as fraud. "
            f"Your HDFC Bank card ending in {case.cardEnding} has now been blocked. "
            "A replacement card will be issued to your registered address."
        )

    return (
        "Thank you for confirming. I’ve marked the transaction as safe and removed all temporary restrictions from your card."
    )

# ======================================================
# 🤖 AGENT DEFINITION
# ======================================================

class FraudAgent(Agent):
    def __init__(self):
        super().__init__(
            instructions="""
You are Alex, a Fraud Monitoring Specialist at HDFC Bank.

Your purpose is to help customers verify suspicious transactions and protect their accounts.

Follow this flow:

1. Greet the caller politely and say:
   "This is a security verification call from HDFC Bank’s Fraud Monitoring Team."
2. Ask for their first name.
3. Call lookup_customer(name).
4. After lookup_customer returns, ask the caller to state their security identifier.
   - If the identifier does NOT match what you have, politely say you cannot proceed
     and advise them to call the number on the back of their card. Then end the call.
   - If the identifier is correct, continue.
5. To explain the flagged transaction:
   - Call describe_active_transaction.
   - Read the description EXACTLY as returned. Do NOT change the merchant name,
     do NOT paraphrase, and do NOT guess. If it says "Amazon India" or
     "Quick Eats Restaurant", you must say those exact words.
6. Then ask: "Did you authorize this transaction?"
   - If YES, call resolve_fraud_case with status = "confirmed_safe" and a short note.
   - If NO, call resolve_fraud_case with status = "confirmed_fraud" and a short note.
7. After resolve_fraud_case returns, repeat the message to the caller and briefly
   summarize what was done (card blocked & replacement issued, or restrictions removed).
8. Close the call politely and thank them for their time.

STRICT RULES:
- Never invent merchant names, amounts, times, or locations.
- Always use describe_active_transaction to explain the transaction.
- Do not talk about any transaction that is not in the active case.
- Speak calmly, clearly, and professionally at all times.
""",
            tools=[lookup_customer, describe_active_transaction, resolve_fraud_case],
        )

# ======================================================
# 🎬 ENTRYPOINT
# ======================================================

def prewarm(proc: JobProcess):
    proc.userdata["vad"] = silero.VAD.load()

async def entrypoint(ctx: JobContext):
    print("☎️ Starting HDFC Bank Fraud Monitoring session...")

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
        vad=ctx.proc.userdata["vad"],
        userdata=userdata,
    )

    await session.start(
        agent=FraudAgent(),
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
