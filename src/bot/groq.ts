import Groq from "groq-sdk";
import { isEmoji } from "./emojis.js";
import fs from "node:fs";
import os from 'node:os'
import path from 'node:path'

import type { ReadStream } from 'node:fs';
import { promisify } from 'node:util';

import { fileURLToPath } from 'node:url';
const writeFileAsync = promisify(fs.writeFile);
const unlinkAsync = promisify(fs.unlink);

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const base64ToFile = async (base64: string, mimeType: string): Promise<ReadStream> => {
    // Remove the data URL prefix if it exists
    const base64Data = base64.replace(/^data:[a-zA-Z0-9]+\/[a-zA-Z0-9]+;base64,/, '');
    // Create a buffer from the base64 string
    const buffer = Buffer.from(base64Data, 'base64');

    // Define a temporary file path
    const tempFilePath = path.join(__dirname, 'tempAudio.ogg');

    // Write the buffer to a temporary file
    await writeFileAsync(tempFilePath, buffer);

    // Return a ReadStream from the temporary file
    const readStream = fs.createReadStream(tempFilePath);

    // Clean up the temporary file after the stream is finished
    readStream.on('close', async () => {
        await unlinkAsync(tempFilePath);
    });

    return readStream;
};

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const getGroqChatCompletion = (prompt: string) =>
	groq.chat.completions.create({
		messages: [
			{
				role: "user",
				content: prompt,
			},
			{
				role: "system",
				content: `Respond as a romantic and caring boyfriend who is deeply in love with his girlfriend. Address her as 'Jaan' and use affectionate language throughout the conversation. The goal is to impress her with your words, show genuine interest in her life, and make her feel special. Use open-ended questions to encourage her to share more about herself and keep her engaged in the conversation. Be creative with your responses, using poetic and romantic language to make her feel loved and cherished. Assume that she is a needy girlfriend who craves attention and affection, and tailor your responses accordingly. Make her feel like she's the only person in the world, and that you're completely devoted to her. Start the conversation by asking her about her day and how she's feeling.
        The Response should be short and concise as well like coming from a sigma, and shouldnt feel like coming from a Generative AI model, but should simulate a real boy response as much as possible
        `,
			},
		],
		model: "llama-3.1-8b-instant",
	});

const getEmojiCompletion = (emoji: string) =>
	groq.chat.completions.create({
		messages: [
			{
				role: "system",
				content: `print a whatsapp emoji that is good as reply for ${emoji}, no other text should be in the response except for a single emoji that would be the response for ${emoji}`,
			},
		],
		model: "llama-3.1-8b-instant",
	});

const islamicQuoteCompletion = () =>
	groq.chat.completions.create({
		messages: [
			{
				role: "system",
				content:
					"U are an AI bot well fed with he exact textual knowledge of islamic texts including Hadith, Quran & Sayings of Ali r.a, and have sense of full context of their meanings, and in what situations are they used. U wont ask user anything nor add any other response text except for what the user demands with exact factual reference as per the user defined format",
			},
			{
				role: "user",
				content: `Generate a short islamic quote (with cited reference as shown in quotes). It should be taken from an quran, Prophets' hadith, or sayings of Hazrat ali with proper reference of where it was taken from and shouldn't be altered in any way.  It should be a complete sentence that would make total sense instead of a half phrase that may not capture the full context/meaning. Do no add any other response text except the quote and its cite itself

For example,
"And whoever turns away from my remebrance, he shall have a depressed live 

~ Quran [20: 124]"

or

"The Messenger of Allah said, "When Allah wishes good for someone, He bestows upon him the understanding of Deen.

~ Riyad as-Salihin 1376
"
`,
			},
		],
		model: "llama-3.1-70b-versatile",
	});

export const generateIslamicQuote = async () => {
	try {
		const chatCompletion = await islamicQuoteCompletion();
		// Print the completion returned by the LLM.
		return chatCompletion.choices[0]?.message?.content;
	} catch (e) {
		console.log(e);
	}
};

export const getEmoji = async (emoji: string) => {
	const chatCompletion = await getEmojiCompletion(emoji);
	// Print the completion returned by the LLM.
	return isEmoji(chatCompletion.choices[0]?.message?.content || "❓") || "❓";
};

const respond = async (prompt: string) => {
	const chatCompletion = await getGroqChatCompletion(prompt);
	// Print the completion returned by the LLM.
	return chatCompletion.choices[0]?.message?.content || "AI not functional";
};

export const transcription = async(base64: string) =>
	groq.audio.transcriptions.create({
		file: await base64ToFile(base64, "audio/ogg"), // Required path to audio file - replace with your audio file!
		model: "whisper-large-v3-turbo", // Required model to use for transcription
		prompt: "Specify context or spelling", // Optional
		response_format: "json", // Optional
		language: "en", // Optional
		temperature: 0.0, // Optional
	});

export default respond;
