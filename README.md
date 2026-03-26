# Zendesk MCP Server

This is a Render-ready MCP server that exposes Zendesk API endpoints for Base44 MCP.

## Endpoints

- `GET /` → Health check
- `POST /tools/get_tickets` → Get all tickets
- `POST /tools/get_tickets_last_24h` → Get tickets created in the last 24 hours
- `POST /tools/create_ticket` → Create a new ticket (body: `{ subject, comment }`)
- `POST /tools/get_ticket` → Get a ticket by ID (body: `{ ticket_id }`)

## Deployment on Render

1. Connect this repo to Render as a **Web Service**.
2. Set Environment Variables:
   - `ZENDESK_SUBDOMAIN`
   - `ZENDESK_EMAIL`
   - `ZENDESK_API_TOKEN`
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Deploy → Render will provide a public URL for your MCP server.
