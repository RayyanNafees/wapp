import wweb, { Client } from "whatsapp-web.js";

import qrcode from "qrcode-terminal";
import respond, { getEmoji } from "./groq.js";
import emojis, { isEmoji } from "./emojis.js";

// Require database

if (! process.env.CHROMIUM_URL) {throw 'Process Env is not parse'} 
console.log('Chromium URL', process.env.CHROMIUM_URL)

// Create a new client instance
const client = new Client({
	puppeteer: {
		args: ["--no-sandbox", "--disable-setuid-sandbox"],
		browserURL: process.env.CHROMIUM_URL,
		timeout: 160 * 1000,
	},
	authStrategy: new wweb.LocalAuth({
		clientId: "session",
		dataPath: "session",
	}),
});

// When the client is ready, run this code (only once)
client.once("ready", () => {
	console.log("Client is ready!");
});

// When the client received QR-Code
client.on("qr", (qr) => {
	console.log("QR RECEIVED", qr);
	qrcode.generate(qr, { small: true });
});

// let sentLoveYou = false;

// setInterval(
// 	() => {
// 		sentLoveYou = false;
// 	},
// 	5 * 60 * 1000,
// ); // every 10 mins

client.on("message_create", (message) => {
	if (message.type === "chat") {
		// Mary zub
		if (message.from === "919760599498@c.us") {
			const msgText = message.body.trim().toLowerCase();
			// if (!sentLoveYou && message.body !== "I hate you idiot!") {
			// 	message.reply("I love you!");
			// } else sentLoveYou = true;

			if (msgText.includes("lol")) message.react("😂");

			for (const e in emojis) {
				if (msgText.startsWith(e)) message.react(emojis[e]);
			}

			const first = msgText.at(0);
			if (first && isEmoji(first)) {
				console.log(first);
				getEmoji(first as string).then((e) => {
					console.log(e);

					if (isEmoji(String(e))) message.react(String(e));
				});
			}

			if (msgText.startsWith("jaan")) {
				respond(message.body.trim().substring(4)).then((response) =>
					message.reply(String(response)),
				);
			}
		}
	}
	// if (message.body === '!ping') {
	// 	// reply back "pong" directly to the message
	// 	message.reply('pong');
	// }
	// if (message.from([
	// 	+'919760599498'
	// ]))
	// message.reply(message.body)
	// else {
	// }
	// message.getContact().then(c=> console.log("promise", c.id, c.number, c.name,))
	console.log("author:", message.author);
	console.log("message.id.remote:", message.id.remote);
	console.log("from:", message.from);
	console.log("to:", message.to);
	console.log(message.type);
});

client.on("remote_session_saved", () => {
	// Do Stuff...
	console.log("Remote session saved!");
});

client.on("auth_failure", (message) =>
	console.log("Auth failed, message:", message),
);

client.on("authenticated", (message) =>
	console.log("Client Authenticated", message),
);
// Start your client
export default client;
