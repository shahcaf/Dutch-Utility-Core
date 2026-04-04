# VlaamsCore

A robust, modular Discord bot specifically tailored for moderation, server management, and roleplay utilities in a Dutch/Vlaanderen RP server context.

## Requirements

* Node.js v16.9.0 or newer
* CockroachDB (or any PostgreSQL compatible database)
* Discord Bot Token and Client ID

## Setup Instructions

1. **Clone the repository.**
2. **Install dependencies:** `npm install`
3. **Database Setup:**
   * Create a CockroachDB cluster.
   * Add your `DATABASE_URL` to the `.env` file.
4. **Database Migration:**
   * Run `npm run build` to synchronize the schema and generate the client.
5. **Start the Bot:**
   * Run `npm start`.

## Deployment to Render

1. Create a new "Web Service" on [Render](https://render.com).
2. **Build Command:** `npm run build`
3. **Start Command:** `npm start`
4. **Environment Variables:**
   * `NODE_VERSION`: `22.12.0`
   * `DISCORD_TOKEN`: Your bot token.
   * `CLIENT_ID`: Your bot's client ID.
   * `DATABASE_URL`: Your CockroachDB URL.
   * `RENDER_EXTERNAL_URL`: Your app's Render URL (for Keep-Alive).

## Features

- **Mega Command:** `/cmd` acts as the control panel for all actions.
- **Port Binding:** It has an Express app bundled that bounds to `$PORT` required by Render.
- **Prisma Integration:** Scalable ORM tailored for CockroachDB.
