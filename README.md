# Revolt Motors AI Voice Assistant (Gemini API Demo)

A real‑time conversational voice interface that replicates the functionality of the Revolt Motors chatbot. The application streams audio responses, supports user interruptions, and maintains low latency using the Google Gemini API.

### ✨ Core Features

-   **Real-Time Conversation:** Enables natural, spoken conversation with an AI assistant.
-   **Streaming Responses:** AI responses are streamed back as text in real-time for low perceived latency.
-   **Interruption Handling:** The user can interrupt the AI at any point, and the system will immediately process the new input.
-   **Custom Persona:** The AI is configured with a system prompt to act as "Rev," a knowledgeable and friendly customer assistant for Revolt Motors.
-   **Secure Server-Side Architecture:** The backend handles all communication with the Gemini API, keeping the API key secure and processing audio streams from the client.
  ### 🛠️ Technology Stack

-   **Layer:** Technology
-   **Backend:** Node.js, Express.js, WebSockets (`ws`)
-   **Frontend:** HTML5, CSS3, Vanilla JavaScript (MediaRecorder API)
-   **AI Model:** Google Gemini 1.5 Pro / Flash
-   **Platform:** Google AI Studio
-   **Enivornment:** dotenv for secret management, cors for cross‑origin requests

### ✅ Prerequisites

-   [Node.js](https://nodejs.org/) (v18.0 or later)
-   [Git](https://git-scm.com/)

---

### 🚀 Local Setup and Installation

**1. Clone the Repository**
```cmd
git clone https://github.com/himanshumahtolia/gemini-voice-chatbot.git
cd gemini-voice-chatbot
```
**2. Intall Backend Dependencies**
```cmd
cd backend
npm install
```
**3. Configure Environment Variables**
- Create a file named .env inside the backend directory.
-Add your Google Gemini API key to this file:
GEMINI_API_KEY="YOUR_API_KEY_HERE"
-You can obtain a free API key from aistudio.google.com

###📦 Project Structure
```cmd
gemini-voice-chatbot/
├─ backend/               # Express + WebSocket server
│   ├─ server.js
│   ├─ .env              # <-- API key 
│   └─ package.json
├─ frontend/              # Simple HTML/CSS/JS UI
│   ├─ index.html
│   ├─ style.css
│   └─ script.js
├─ .gitignore
└─ README.md
```

### ▶️ Running the Application
This project requires two terminals to run the backend and frontend servers concurrently.
1. Start the Backend Server

* In your first terminal, navigate to the backend directory and run:

``` cmd
node server.js
```
The server will start on ws://localhost:3001.
2. Start the Frontend Server

* In your second terminal, navigate to the frontend directory.
* Use npx to run a simple live server:

```cmd
npx serve
```
The frontend will be available at http://localhost:3000 (or the URL provided by the serve command).
3. Open the Application

* Open your web browser and navigate to http://localhost:3000.
