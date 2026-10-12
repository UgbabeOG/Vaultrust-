# Deploy the frontend on Vessel and the API on Render

The frontend and API are deployed as separate services from this repository:

- **Vessel** builds and serves the Vite frontend.
- **Render** runs the Express API from `server.ts` in API-only mode.
- **Supabase** remains the persistence layer for admin-managed vaults and shipments.

## Deploy the API to Render

1. Create a Render **Web Service** from this repository and use the repository root as its root directory.
2. Render can use the included `render.yaml` blueprint. Otherwise configure:
   - Build command: `npm install`
   - Start command: `npm start`
   - Health check path: `/health`
3. Add these environment variables in the Render service settings:
   - `API_ONLY=true`
   - `CORS_ORIGINS=https://valtrustsentinel.com,https://www.valtrustsentinel.com` (the exact origins, without trailing slashes; add comma-separated origins if needed)
   - `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` for persistent vault and shipment records.
4. Deploy and confirm `https://<your-render-service>.onrender.com/health` returns `{"status":"ok"}`.

Keep Supabase service-role credentials in Render's server-side environment only. Never add them to Vessel or prefix them with `VITE_`.

## Point Vessel at the API

In the Vessel frontend project's environment settings, set:

```text
VITE_API_BASE_URL=https://<your-render-service>.onrender.com
```

Build and redeploy the frontend after setting the variable; Vite embeds `VITE_` variables at build time. The frontend appends its existing `/api/...` routes to this base URL. For local development, leave it empty to use the existing same-origin Vite/Express setup.

## Important behavior

The Render service runs only the API and does not serve the frontend. The API allows the canonical Valtrust website origins above plus any exact origins listed in `CORS_ORIGINS`. This is a browser access policy, not API authentication: the current admin passcode is checked in the frontend, and the admin API routes do not authenticate requests. Treat this deployment as a demo until server-side authentication is added; do not store real or sensitive custody records in it.

Admin-managed vault and shipment data needs Supabase configured; in-memory reservations and other process-local state are not shared across instances and can be lost when Render restarts or scales the service.
