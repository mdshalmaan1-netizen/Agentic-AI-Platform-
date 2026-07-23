<<<<<<< HEAD
# Agentic AI Platform — Frontend

An AI-powered platform for discovering jobs, internships, and hackathons.
Frontend-only React application built with Vite, Tailwind CSS, and dummy data
(ready to be wired up to a real backend via the files in `src/services`).

## Tech Stack

- React.js (Vite)
- React Router DOM
- Tailwind CSS
- Axios
- React Icons
- Framer Motion
- Context API

## Getting Started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

To build for production:

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
  assets/        static images/illustrations
  components/    reusable UI components (JobCard, HackathonCard, Sidebar, etc.)
  layouts/       PublicLayout (landing/auth) & DashboardLayout (app pages)
  pages/         one file per route/screen
  services/      axios API modules (auth, jobs, resume, applications, ai)
  context/       AppContext — user/auth/sidebar state
  hooks/         useDebounce, useLocalStorage
  utils/         dummyData.js — mock jobs/internships/hackathons/etc.
  App.jsx        route definitions
  main.jsx       app entry point
```

## Routes

| Path            | Page                        |
|-----------------|------------------------------|
| `/`             | Landing Page                 |
| `/login`        | Login                        |
| `/register`     | Register                     |
| `/dashboard`    | Dashboard                    |
| `/jobs`         | Jobs listing                 |
| `/internships`  | Internships listing          |
| `/hackathons`   | Hackathons                   |
| `/assistant`    | AI Career Assistant (chat)   |
| `/resume`       | Resume Analyzer              |
| `/interview`    | Interview Preparation        |
| `/applications` | Application Tracker          |
| `/profile`      | Profile                      |
| `/settings`     | Settings                     |

## Connecting a real backend

Every page currently reads from `src/utils/dummyData.js`. Each domain also has
a matching Axios service in `src/services/` (e.g. `jobs.js`, `resume.js`,
`ai.js`) already wired to call a REST API — swap the dummy-data imports in a
page for the corresponding service call and point `VITE_API_BASE_URL` (in a
`.env` file) at your backend.

## Theme

Light theme, cream background with a forest-green primary accent, matching
the original product mockups. Colors are defined in `tailwind.config.js`
under `theme.extend.colors` (`cream`, `forest`, `ink`).
=======
# Agentic-AI-Platform-
>>>>>>> 3036ce90f31ed499326070b2cf137cb33a6777be
