# TeachPortal — Frontend 

A responsive single-page application for teachers to manage their students. Built with React 19 and backed by a .NET 8 REST API.

## Features

- **Secure authentication** — JWT-based login and registration; token expiry is checked client-side before every protected request
- **Student management** — Add new students, search by name or email, sort by any column, and paginate results
- **Teacher overview** — Browse all teachers and view each teacher's assigned students in a responsive side-by-side panel
- **Mobile-first layout** — Sticky navbar with animated hamburger menu; all pages are fully responsive down to 320 px


## Tech Stack

| | |
|---|---|
| Framework | React 19 |
| Routing | React Router v7 |
| HTTP | Axios with request/response interceptors |
| Auth | JWT (localStorage), parsed client-side for claims and expiry |
| Styling | Plain CSS with CSS custom properties (design tokens) |

## Project Structure

```
src/
├── Components/
│   ├── Layout.js          # Sticky navbar with hamburger menu, auth-aware links
│   └── PrivateRoute.js    # Route guard — redirects unauthenticated users to /login
├── Pages/
│   ├── Login/             # Sign-in form with client-side validation
│   ├── Signup/            # Registration form with real-time password strength meter
│   ├── Dashboard/         # Add students; sortable, searchable, paginated table
│   └── TeacherOverview/   # All teachers list + student detail panel side-by-side
├── Services/
│   ├── AuthService.js     # Login, logout, JWT parsing, isAuthenticated()
│   └── api.js             # Axios instance — attaches Bearer token, handles 401 redirect
└── Validation/
    └── validation.js      # Reusable field validators (length, email, etc.)
```

## Getting Started

### Prerequisites
- Node.js 18+
- The TeachPortal backend API running (see [TeachPortal](https://github.com/nivigot/TeachPortal))

### Installation

```bash
git clone https://github.com/nivigot/TeachPortalWeb.git
cd TeachPortalWeb
npm install
npm start
```

App runs at `http://localhost:3000`.

### Environment Variables

Create a `.env` file to point at a different API:

```
REACT_APP_API_URL=https://your-api-host/api
```

### Production Build

```bash
npm run build
```

Output lands in `build/` — deployable to Netlify, Vercel, Azure Static Web Apps, or any static host.

## How Authentication Works

1. On login, `AuthService` calls `POST /api/auth/login` and stores the returned JWT in `localStorage`
2. The Axios interceptor reads the token and attaches `Authorization: Bearer <token>` to every subsequent request
3. On a 401 or 403 response, the interceptor clears the token and redirects to `/login`
4. `PrivateRoute` uses `AuthService.isAuthenticated()` which parses the `exp` claim in the JWT to verify the token hasn't expired before rendering any protected page

## Author

Poongothai Senthurkumar — [GitHub](https://github.com/nivigot)
