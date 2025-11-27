# 🚀 AI Voice Agents Challenge — Starter Repository

Welcome to the **AI Voice Agents Challenge** by [murf.ai](https://murf.ai)!  
You’re among the very first developers to build with **Murf Falcon** — the consistently fastest TTS API — and push the boundaries of voice AI.

---

## 🌟 About the Challenge

We just launched **Murf Falcon**, and you're invited to **build 10 AI Voice Agents in 10 days** with guidance from Murf developers and community champions.

### 🧠 How It Works

- A new task is released **every day**, along with a reference GitHub repo  
- You build a **voice agent with unique personas + skills**  
- Share your work on **GitHub + LinkedIn**

---

## 📁 Repository Structure

This monorepo includes both the **backend** and **frontend**, giving you a complete setup for building voice agents.

```bash
falcon-tdova-nov25-livekit/
├── backend/          # LiveKit Agents backend with Murf Falcon TTS
├── frontend/         # React/Next.js frontend for voice interaction
├── start_app.sh      # Script to start all services
└── README.md         # This file
```

---

## 🧩 Backend

The backend builds on [LiveKit’s agent-starter-python](https://github.com/livekit-examples/agent-starter-python) and integrates **Murf Falcon TTS** for blazing-fast speech synthesis.

### 🔥 Features

- LiveKit Agents framework for full voice AI pipelines  
- **Murf Falcon TTS integration**  
- LiveKit Turn Detector for contextual speaker detection  
- Background voice cancellation  
- Integrated logs + metrics  
- Complete test suite  
- Production-ready Dockerfile  

👉 **[Backend Documentation](./backend/README.md)**

---

## 🎨 Frontend

The frontend builds on [LiveKit’s agent-starter-react](https://github.com/livekit-examples/agent-starter-react), offering a modern UI for voice interactions.

### 🌈 Features

- Real-time voice conversations  
- Camera video streaming  
- Screen sharing  
- Audio levels + visualizers  
- Light/dark theme  
- Highly customizable branding  

👉 **[Frontend Documentation](./frontend/README.md)**

---

## ⚡ Quick Start

### ✅ Prerequisites

Make sure you have the following installed:

- Python 3.9+ with [uv](https://docs.astral.sh/uv/) package manager  
- Node.js 18+ with pnpm  
- [LiveKit CLI](https://docs.livekit.io/home/cli/cli-setup) (optional but recommended)  
- [LiveKit Server](https://docs.livekit.io/home/self-hosting/local/) for local development  

---

## 1️⃣ Clone the Repository

```bash
git clone <your-repo-url>
cd falcon-tdova-nov25-livekit
```

---

## 2️⃣ Backend Setup

```bash
cd backend

# Install dependencies
uv sync

# Copy and configure env file
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

- `LIVEKIT_URL`  
- `LIVEKIT_API_KEY`  
- `LIVEKIT_API_SECRET`  
- `MURF_API_KEY` (for Falcon TTS)  
- `GOOGLE_API_KEY` (for Gemini LLM)  
- `DEEPGRAM_API_KEY` (for Deepgram STT)

Download required models:

```bash
uv run python src/agent.py download-files
```

For LiveKit Cloud users, you can automatically populate credentials:

```bash
lk cloud auth
lk app env -w -d .env.local
```

---

## 3️⃣ Frontend Setup

```bash
cd frontend

# Install dependencies
pnpm install

# Copy environment file and configure
cp .env.example .env.local
```

Edit `.env.local` with the same LiveKit credentials.

---

## 4️⃣ Run the Application

### Install LiveKit server

```bash
brew install livekit
```

You have two options:

---

### 🔹 Option A: Use the convenience script (runs everything)

```bash
# From the root directory
chmod +x start_app.sh
./start_app.sh
```

This will start:

- LiveKit Server (in dev mode)  
- Backend agent (listening for connections)  
- Frontend app (at http://localhost:3000)

---

### 🔹 Option B: Run services individually

```bash
# Terminal 1 - LiveKit Server
livekit-server --dev
```

```bash
# Terminal 2 - Backend Agent
cd backend
uv run python src/agent.py dev
```

```bash
# Terminal 3 - Frontend
cd frontend
pnpm dev
```

Then open **http://localhost:3000** in your browser!

---

## 📆 Daily Challenge Tasks

Each day, you'll receive a new task that builds upon your voice agent. The tasks will help you:

- Implement different personas and conversation styles  
- Add custom tools and capabilities  
- Integrate with external APIs  
- Build domain-specific agents (customer service, tutoring, etc.)  
- Optimize performance and user experience  

**Stay tuned for daily task announcements!**

---

## 📚 Documentation & Resources

- [Murf Falcon TTS Documentation](https://murf.ai/api/docs/text-to-speech/streaming)  
- [LiveKit Agents Documentation](https://docs.livekit.io/agents)  
- [Original Backend Template](https://github.com/livekit-examples/agent-starter-python)  
- [Original Frontend Template](https://github.com/livekit-examples/agent-starter-react)

---

## 🧪 Testing

The backend includes a comprehensive test suite:

```bash
cd backend
uv run pytest
```

Learn more about testing voice agents in the [LiveKit testing documentation](https://docs.livekit.io/agents/build/testing/).

---

## 🤝 Contributing & Community

This is a challenge repository, but we encourage collaboration and knowledge sharing!

- Share your solutions and learnings on GitHub  
- Post about your progress on LinkedIn  
- Join the [LiveKit Community Slack](https://livekit.io/join-slack)  
- Connect with other challenge participants  

Maintainer: **[Sanket Bharadwaj](https://github.com/Sanket-Bharadwaj)**

---

## 📜 License

This project is based on MIT-licensed templates from LiveKit and includes integration with Murf Falcon.  
See individual LICENSE files in `backend` and `frontend` directories for details.

---

## 🎉 Have Fun!

Remember, the goal is to learn, experiment, and build amazing voice AI agents. Don't hesitate to be creative and push the boundaries of what's possible with Murf Falcon and LiveKit!

Good luck with the challenge! 🚀

---

Built for the AI Voice Agents Challenge by **murf.ai**
