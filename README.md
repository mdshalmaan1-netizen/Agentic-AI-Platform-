<<<<<<< HEAD
# Agentic AI Platform (Google Gemini + Node.js + Express.js)

A multi-agent AI backend that uses the **Google Gemini API** to power five
independent career-assistance agents, each exposed as its own REST API
route — plus optional **WhatsApp notifications** (via Twilio) so any
agent can text you its result directly.

---

## 1. Architecture

```
agentic-ai-platform/
├── server.js                  # Express app entry point, mounts all routes
├── config/
│   ├── gemini.js               # Gemini client + generateContent/generateJSON helpers
│   └── whatsapp.js             # Twilio WhatsApp client + sendWhatsAppMessage helper
├── utils/
│   ├── promptTemplates.js      # All prompt engineering, centralized per agent
│   └── whatsappFormatters.js   # Turns each agent's JSON output into a WhatsApp text summary
├── routes/
│   ├── resumeAnalyzer.js       # Agent 1
│   ├── jobMatching.js          # Agent 2
│   ├── coverLetter.js          # Agent 3
│   ├── interviewPrep.js        # Agent 4
│   ├── careerChatbot.js        # Agent 5
│   └── whatsappNotify.js       # Standalone WhatsApp send endpoint
├── public/
│   └── index.html              # Browser test console for all agents + WhatsApp
├── .env.example
├── package.json
└── README.md
```

**Design principles used:**
- **Separation of concerns** — prompt text, Gemini plumbing, and route/HTTP
  logic each live in their own file.
- **One router per agent** — mounted under `/api/agents/<agent-name>` so
  each agent is independently testable and extensible.
- **Environment variables** — the Gemini API key and model name are never
  hardcoded; they come from `.env`.
- **JSON-safety net** — `generateJSON()` strips markdown fences (```json```)
  that Gemini sometimes wraps around output and falls back to regex
  extraction if needed, so routes get clean, parsed JSON every time.

---

## 2. Setup

### Prerequisites
- Node.js 18+
- A free Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
- (Optional, for WhatsApp notifications) A free Twilio account with the WhatsApp Sandbox activated — see [Section 5](#5-whatsapp-notifications-setup) below

### Install
```bash
cd agentic-ai-platform
npm install
```

### Configure environment variables
```bash
cp .env.example .env
```
Edit `.env`:
```env
GEMINI_API_KEY=your_actual_key_here
GEMINI_MODEL=gemini-1.5-flash
PORT=5000
NODE_ENV=development

# Optional — only needed if you want WhatsApp notifications
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```
If you skip the Twilio variables, everything still works — the AI agents
respond normally, and any `notifyWhatsApp: true` request just returns
`{ whatsapp: { success: false, error: "WhatsApp is not configured..." } }`
instead of crashing the server.

### Run
```bash
npm start          # production
npm run dev         # nodemon, auto-reload
```

Server starts at `http://localhost:5000`.
Open `http://localhost:5000` in a browser for a quick test console, or hit
the REST endpoints directly (see below).

---

## 3. The 5 Agents — API Reference

All endpoints:
- Accept `POST` with `Content-Type: application/json`
- Return `{ success: boolean, agent: string, data?: object, error?: string }`

### Agent 1 — Resume Analyzer
**`POST /api/agents/resume-analyzer`**

Sends the resume text to Gemini with a prompt instructing it to act as an
ATS/resume-review specialist and return structured JSON. Useful for resume
scoring dashboards.

Request:
```json
{
  "resumeText": "John Doe... Full resume text here...",
  "notifyWhatsApp": false,
  "phoneNumber": "+919876543210"
}
```
`notifyWhatsApp` and `phoneNumber` are optional. Set `notifyWhatsApp: true`
and provide `phoneNumber` to also receive a WhatsApp summary of the result.

Response `data`:
```json
{
  "skills": ["..."],
  "programmingLanguages": ["..."],
  "frameworks": ["..."],
  "projects": [{ "name": "", "description": "", "technologies": [] }],
  "certifications": ["..."],
  "education": [{ "degree": "", "institution": "", "year": "" }],
  "experience": [{ "role": "", "company": "", "duration": "", "highlights": [] }],
  "resumeScore": 82,
  "scoreBreakdown": { "formatting": 20, "keywordRelevance": 22, "impactAndMetrics": 18, "completeness": 22 },
  "missingSkills": ["..."],
  "improvementSuggestions": ["..."]
}
```

### Agent 2 — Job Matching Agent
**`POST /api/agents/job-matching`**

Compares a resume against a job description. Gemini is prompted to act as
a recruiter, compute a match percentage, and explain its reasoning — this
"reason for score" field is what makes the score trustworthy/explainable
rather than a black box.

Request:
```json
{
  "resumeText": "...",
  "jobDescription": "...",
  "notifyWhatsApp": false,
  "phoneNumber": "+919876543210"
}
```

Response `data`:
```json
{
  "matchPercentage": 74,
  "matchingSkills": ["..."],
  "missingSkills": ["..."],
  "suggestionsToImproveResume": ["..."],
  "reasonForScore": "...",
  "seniorityFit": "Good Fit",
  "keywordGaps": ["..."]
}
```

### Agent 3 — Cover Letter Generator
**`POST /api/agents/cover-letter`**

Generates a personalized, non-generic cover letter grounded only in facts
present in the candidate's resume (the prompt explicitly forbids inventing
qualifications).

Request:
```json
{
  "companyName": "Google",
  "jobTitle": "Frontend Engineer",
  "resumeText": "...",
  "notifyWhatsApp": false,
  "phoneNumber": "+919876543210"
}
```

Response `data`:
```json
{ "coverLetter": "Dear Hiring Manager,\n\n...", "wordCount": 320 }
```

### Agent 4 — Interview Preparation Agent
**`POST /api/agents/interview-prep`**

Generates a complete interview prep kit for a given role: 10 technical
questions, 10 HR/behavioral questions, and 5 coding problems tagged by
difficulty and topic.

Request:
```json
{
  "jobTitle": "Backend Developer",
  "notifyWhatsApp": false,
  "phoneNumber": "+919876543210"
}
```

Response `data`:
```json
{
  "jobTitle": "Backend Developer",
  "technicalQuestions": ["... x10"],
  "hrQuestions": ["... x10"],
  "codingQuestions": [
    { "question": "...", "difficulty": "Medium", "topic": "Arrays" }
  ]
}
```

### Agent 5 — Career Chatbot
**`POST /api/agents/career-chatbot`**

A free-form conversational agent for questions like "Find React
internships", "Improve my resume", "Explain Docker", "Suggest cloud
certifications", "Recommend hackathons". Unlike the other agents, this
returns plain conversational text (not structured JSON), and keeps a
short rolling history per `sessionId` (in-memory — swap for Redis/DB in
production).

Request:
```json
{
  "message": "Explain Docker.",
  "sessionId": "user-123",
  "notifyWhatsApp": false,
  "phoneNumber": "+919876543210"
}
```

Response `data`:
```json
{ "reply": "Docker is a tool that packages...", "sessionId": "user-123" }
```

Clear a session's memory:
```
DELETE /api/agents/career-chatbot/:sessionId
```

### Agent 6 (utility) — Standalone WhatsApp Notifier
**`POST /api/notify/whatsapp`**

Send any custom WhatsApp message independent of the AI agents — useful for
job alerts, "your resume score is ready" pings, interview reminders, etc.

Request:
```json
{ "phoneNumber": "+919876543210", "message": "Your interview is in 1 hour. Good luck!" }
```

Response:
```json
{ "success": true, "agent": "WhatsApp Notifier", "data": { "sid": "SMxxxxxxxx..." } }
```

Check whether WhatsApp is configured:
```
GET /api/notify/whatsapp/status
→ { "success": true, "configured": true }
```

### Every AI agent response includes an optional `whatsapp` field

When you pass `notifyWhatsApp: true` to any of the 5 AI agents above, the
response also includes:
```json
{
  "whatsapp": { "success": true, "sid": "SMxxxxxxxx..." }
}
```
or, if something went wrong (missing phone number, Twilio not configured,
invalid number, etc.):
```json
{
  "whatsapp": { "success": false, "error": "..." }
}
```
This never blocks or fails the main AI response — WhatsApp delivery is
always a best-effort side effect.

### Utility endpoints
- `GET /api/health` — health check + which Gemini model is configured
- `GET /api` — machine-readable index of all agent endpoints
- `GET /api/notify/whatsapp/status` — whether Twilio WhatsApp is configured

---

## 4. WhatsApp Notifications Setup

WhatsApp delivery uses **Twilio's WhatsApp API** (the official, ToS-compliant
way to send WhatsApp messages programmatically — not browser automation).

### Free sandbox setup (good for development/testing)
1. Create a free account at **https://www.twilio.com/try-twilio**
2. In the Twilio Console, go to **Messaging → Try it out → Send a WhatsApp message**
   to activate your sandbox.
3. On your own phone, open WhatsApp and send the message
   `join <your-sandbox-code>` (shown on that page) to the Twilio sandbox
   number. This links your phone to the sandbox so it can receive messages.
4. Copy from the Twilio Console:
   - **Account SID** → `TWILIO_ACCOUNT_SID`
   - **Auth Token** → `TWILIO_AUTH_TOKEN`
   - **Sandbox WhatsApp number** (usually `whatsapp:+14155238886`) → `TWILIO_WHATSAPP_FROM`
5. Paste all three into your `.env` file.

### Sandbox limitations to know
- Only phone numbers that have sent the `join <code>` message can receive
  messages from your sandbox.
- Sandbox sessions can expire after a period of inactivity — just re-send
  the `join` message if messages stop arriving.
- For production (messaging any user without a prior opt-in step), you'd
  apply for a verified **WhatsApp Business Sender** through Twilio, which
  requires business verification with Meta.

### Testing without Twilio at all
You don't need Twilio to use the AI agents — just leave the `TWILIO_*`
variables unset. The server logs a warning on startup, and any
`notifyWhatsApp: true` request simply returns
`{ whatsapp: { success: false, error: "WhatsApp is not configured..." } }`
without affecting the AI response.

---

## 5. How the Gemini integration works (`config/gemini.js`)

```js
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL });
const result = await model.generateContent(prompt);
const text = result.response.text();
```

Two helpers are exported for routes to use:
- `generateContent(prompt)` → raw text (used by the chatbot, which wants
  natural conversational prose, not JSON).
- `generateJSON(prompt)` → raw text run through `safeJSONParse()`, which
  strips ` ```json ` fences and falls back to regex-extracting the first
  `{...}`/`[...]` block, then `JSON.parse`s it. Used by the other 4
  agents, all of which are prompted to "return ONLY valid JSON matching
  this exact schema."

This pattern — **strict schema in the prompt + a parsing safety net in
code** — is what makes LLM output usable as a real API response instead
of freeform text you'd have to eyeball.

---

## 6. Example curl requests

```bash
# Agent 1
curl -X POST http://localhost:5000/api/agents/resume-analyzer \
  -H "Content-Type: application/json" \
  -d '{"resumeText": "Jane Smith, Software Engineer with 3 years experience in React, Node.js, AWS..."}'

# Agent 2
curl -X POST http://localhost:5000/api/agents/job-matching \
  -H "Content-Type: application/json" \
  -d '{"resumeText": "...", "jobDescription": "Looking for a React developer with 3+ years..."}'

# Agent 3
curl -X POST http://localhost:5000/api/agents/cover-letter \
  -H "Content-Type: application/json" \
  -d '{"companyName": "Netflix", "jobTitle": "Backend Engineer", "resumeText": "..."}'

# Agent 4
curl -X POST http://localhost:5000/api/agents/interview-prep \
  -H "Content-Type: application/json" \
  -d '{"jobTitle": "Data Scientist"}'

# Agent 5
curl -X POST http://localhost:5000/api/agents/career-chatbot \
  -H "Content-Type: application/json" \
  -d '{"message": "Suggest cloud certifications.", "sessionId": "demo"}'

# Agent 1 with WhatsApp notification
curl -X POST http://localhost:5000/api/agents/resume-analyzer \
  -H "Content-Type: application/json" \
  -d '{"resumeText": "...", "notifyWhatsApp": true, "phoneNumber": "+919876543210"}'

# Standalone WhatsApp notifier
curl -X POST http://localhost:5000/api/notify/whatsapp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+919876543210", "message": "Your resume report is ready!"}'
```

---

## 7. Extending the platform

To add a new agent:
1. Add a prompt builder function in `utils/promptTemplates.js`.
2. Create a new file in `routes/` following the pattern of the existing
   agents (validate input → build prompt → call `generateJSON` or
   `generateContent` → return `{ success, agent, data }`).
3. Mount it in `server.js`:
   ```js
   const myNewAgentRoutes = require("./routes/myNewAgent");
   app.use("/api/agents/my-new-agent", myNewAgentRoutes);
   ```

## 8. Notes on production hardening

- Swap the in-memory chatbot session store for Redis or a database.
- Add authentication (API keys / JWT) in front of `/api/agents/*`.
- Add per-route request validation (e.g. with `zod` or `joi`).
- Consider streaming responses (`generateContentStream`) for the chatbot
  for a real-time typing effect.
- Add caching for repeated resume/job-description pairs to save on
  Gemini API quota/cost.

---

## 9. License
MIT — use freely in your own projects.
=======
# Agentic-AI-Platform-
>>>>>>> 3036ce90f31ed499326070b2cf137cb33a6777be
