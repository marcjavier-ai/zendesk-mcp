import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const baseURL = `https://${process.env.ZENDESK_SUBDOMAIN}.zendesk.com/api/v2`;
const auth = Buffer.from(`${process.env.ZENDESK_EMAIL}/token:${process.env.ZENDESK_API_TOKEN}`).toString("base64");

const zendesk = axios.create({
  baseURL,
  headers: {
    Authorization: `Basic ${auth}`,
    "Content-Type": "application/json",
  }
});

// Health check
app.get("/", (req, res) => {
  res.json({ status: "Zendesk MCP server running" });
});

// Get all tickets
app.post("/tools/get_tickets", async (req, res) => {
  try {
    const response = await zendesk.get("/tickets.json");
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get tickets created in the last 24 hours
app.post("/tools/get_tickets_last_24h", async (req, res) => {
  try {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const response = await zendesk.get(`/search.json?query=type:ticket created>${yesterday}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new ticket
app.post("/tools/create_ticket", async (req, res) => {
  try {
    const { subject, comment } = req.body;
    const response = await zendesk.post("/tickets.json", {
      ticket: {
        subject,
        comment: { body: comment },
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get ticket by ID
app.post("/tools/get_ticket", async (req, res) => {
  try {
    const { ticket_id } = req.body;
    const response = await zendesk.get(`/tickets/${ticket_id}.json`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server (dynamic Render port)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
