import wweb, { Client } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import respond, {
	generateIslamicQuote,
	getEmoji,
	transcription,
} from "./groq.js";
import emojis from "./emojis.js";
import chromium from "chromium";
// Require database

// Create a new client instance
const client = new Client({
	puppeteer: {
		args: ["--no-sandbox", "--disable-setuid-sandbox"],
		// browserURL: process.env.CHROMIUM_URL,
		timeout: 160 * 1000,
		executablePath: chromium.path,
	},
	authStrategy: new wweb.LocalAuth({
		clientId: "session",
		dataPath: "session",
	}),
});

// When the client is ready, run this code (only once)
client.once("ready", () => {
	console.log("Client is ready!");
	// setInterval(() => {
	// 	generateIslamicQuote()
	// 		.then((quote) => {
	// 			console.log("quote: ", quote);
	// 			client.sendMessage(
	// 				"917990751399@c.us",
	// 				quote || "Unable to generate Quote",
	// 			);
	// 		})
	// 		.catch(console.log)
	// 		.finally(() => console.log("ran"));
	// }, 60 * 1000);
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
	console.log(message.type);
	if (message.type === "chat") {
		// Mary zub
		
	}

	if (message.type === "ptt") {
		// console.log("Body: ", message.body);
		// console.log("Raw: ", message.rawData);

		if (message.fromMe)
			message.downloadMedia().then(async (buff) => {
				console.log(
					"Downloaded File: ",
					buff.mimetype,
					buff.filesize,
					buff.filename,
					": \n",
					// buff.data,
				);
				if (buff.filesize && buff.filesize < 25000000)
					transcription(buff.data)
						.then((r) => {
							console.log('To:', message.to)
							console.log('Audio: ', r.text)
							client.sendMessage(message.to, r.text)
						})
						.catch(console.error);
			});
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
	// console.log("author:", message.author);
	// console.log("message.id.remote:", message.id.remote);
	// console.log("from:", message.from);
	// console.log("to:", message.to);
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

// client.setStatus()

// Start your client
export default client;
