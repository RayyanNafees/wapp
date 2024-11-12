const emojis: Record<string, string> = {
	"😂": "🤣",
	"🤣": "😂",
	"❤️": "💖",
	"🥲": "🫠",
	"🐦": "🐦‍⬛",
	"🐦‍⬛": "🐦",
	"😶": "😐",
	"🙂": "🙃",
	"💀": "☠️",
};

export const isEmoji = (emoji: string) => {
	const regex = /\p{Extended_Pictographic}/gu;
	return regex.test(emoji);
};

export default emojis;
