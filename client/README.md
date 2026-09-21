# autonomous-studio — Web Client

React 19 interface for the four-stage Idea → Critic → Refiner → Presenter workflow. Built with Vite 7, React Router 7, Tailwind CSS 4, and Lucide icons.

See the [root README](../README.md) for architecture, backend setup, API contracts, model configuration, and known limitations.

## Local setup

Use Node.js 20.19+ or 22.12+ and npm. From this directory:

```bash
npm ci
cp .env.example .env
npm run dev
```

The template sets `VITE_API_BASE=http://localhost:5000/api`. Start the Flask backend and MongoDB separately. Restart Vite after changing environment variables. Provider keys and JWT secrets belong only in the backend environment.

## Pages

| Route | Purpose |
| --- | --- |
| `/auth` | Registration and login. |
| `/studio` | Topic entry, style/model selection, sequential execution, JSON export. |
| `/agents` | Agent explanations and workflow information. |
| `/preview` | Executive, Detailed, and Minimal layouts, accent colors, browser Print/PDF. |
| `/history` | Paginated saved results and deletion controls. |
| `/profile` | Profile and preferences. |

The root route redirects to `/studio`; authenticated pages sit under `ProtectedRoute`. The client guard is a navigation aid; the server verifies tokens and account status separately.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Vite development server. |
| `npm run build` | Production assets in `dist/`. |
| `npm run preview` | Local preview of built assets. |
| `npm run lint` | ESLint checks; existing violations need separate cleanup. |

If the default build stalls during configuration loading, try `npm run build -- --configLoader runner`.

## Implementation notes

- `Studio.jsx` runs four sequential `fetch` calls to `/api/ai/agents/<stage>`; it does not use the combined `/api/studio/run` route.
- Token and user data are stored in local storage by `utils/auth.js`.
- Model choices in the UI must be kept aligned with `server/config/constansts.py`; the current Claude option has no backend mapping.
- Preview payloads are router state. Sharing the URL does not share generated data.
- Session download is JSON; PDF output uses the browser print dialog.
- `VITE_API_BASE` configures the main flows, but profile and refresh calls still contain localhost URLs.
- `configs/api.js` is an unused Axios helper with a separate environment-variable name and an undeclared Axios dependency.
- `vercel.json` supplies a static SPA rewrite; it does not deploy the Flask server.
