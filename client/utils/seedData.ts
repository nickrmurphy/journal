import type { Entry } from "../collections/entries";

const sampleContents = [
	"Had a great day at the beach today. The weather was perfect and I finally finished reading that book I've been putting off.",
	"Struggling with the new project at work. Need to break it down into smaller tasks tomorrow.",
	"Made an amazing pasta dish for dinner. Should write down the recipe before I forget it.",
	"Went for a morning run and saw the most beautiful sunrise. These early mornings are definitely worth it.",
	"Had coffee with Sarah today. It's been too long since we caught up properly.",
	"Finally organized my closet. Found clothes I forgot I even had!",
	"Trying to learn guitar again. My fingers hurt but I'm determined to stick with it this time.",
	"Rainy day perfect for staying inside and working on my puzzle. Almost halfway done!",
	"Had an interesting conversation with a stranger at the bookstore today. Sometimes unexpected connections are the best.",
	"Feeling grateful for all the small things today. Good health, warm home, loving family.",
];

export function generateSampleEntries(count: number = 10): Entry[] {
	const entries: Entry[] = [];
	const today = new Date();

	for (let i = 0; i < count; i++) {
		const daysAgo = Math.floor(Math.random() * 30); // Random date within last 30 days
		const entryDate = new Date();
		entryDate.setDate(today.getDate() - daysAgo);
		entryDate.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues

		entries.push({
			id: crypto.randomUUID(),
			content: sampleContents[i % sampleContents.length],
			date: entryDate.toISOString().split("T")[0], // ISO date format (YYYY-MM-DD)
			createdAt: entryDate.toISOString(), // ISO datetime format
		});
	}

	return entries.sort(
		(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
	);
}

export const defaultSampleEntries = generateSampleEntries();
