import { serve } from "@hono/node-server";
import { Hono } from "hono";
import client from "./bot/client.js";

const app = new Hono();

console.log("initialising client");
await client.initialize();
console.log("client initialized");

app.get("/", (c) => {
	return c.text(`Hello ${c.req.query("name") || "Hono!"}`);
});

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
	fetch: app.fetch,
	port,
});
