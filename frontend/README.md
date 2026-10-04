# Shortly frontend

The frontend is a React and Vite app styled with Tailwind CSS. It runs independently from the URL shortener backend.

## Run locally

1. From this directory, install dependencies with npm install.
2. Start the backend separately from the repository root. By default it listens on port 3000.
3. Copy .env.example to .env and adjust the public frontend values if needed.
4. Start the frontend with npm run dev, then open the local URL printed by Vite.

The Vite development server forwards requests beginning with /api to http://localhost:3000 and removes the /api prefix. The browser therefore sends API requests to the frontend origin, which avoids needing CORS changes in the backend during development.

## Environment variables

- VITE_API_BASE_URL: API prefix used by the frontend. Use /api for the included development proxy.
- VITE_PUBLIC_SHORT_URL: public base URL used to display and open shortened links. The default is http://localhost:3000.

The backend must be running on port 3000 by default. If you change its port, update the Vite proxy target in vite.config.js as well.
