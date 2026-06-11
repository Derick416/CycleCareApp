# CycleCare Postmark Backend

This backend sends email reminders through Postmark.

## Setup

1. Install dependencies:

   ```bash
   cd backend
   npm install
   ```

2. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

3. Set the Postmark values in `.env`:

   - `POSTMARK_API_TOKEN`
   - `POSTMARK_FROM_EMAIL`

4. Start the server:

   ```bash
   npm start
   ```

## API

POST `/api/send-email`

Request body:

```json
{
  "to": "user@example.com",
  "subject": "Reminder",
  "text": "Your reminder message"
}
```

The app uses this endpoint to send actual reminder emails through Postmark.
