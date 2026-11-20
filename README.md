# Task Manager

The project has a NestJS API and a Next.js UI. Start the API first, then the UI.
Keep both terminal windows running while using the app.

## Run locally

1. In `task-manager-api`, start the API on port 3000:

   ```sh
   npm run start:dev
   ```

2. In a second terminal, start the UI on port 3001:

   ```sh
   cd ../task-manager-ui
   npm run dev
   ```

3. Open http://localhost:3001.

## API endpoints

Base URL: `http://localhost:3000`

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/tasks` | List tasks |
| GET | `/tasks/:id` | Get a task |
| POST | `/tasks` | Create a task (`title` required, `description` optional) |
| PATCH | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |

Tasks are stored in memory and will be cleared when the API restarts.
