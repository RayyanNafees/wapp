import Groq from "groq-sdk";
import { isEmoji } from "./emojis.js";
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

export default respond;
