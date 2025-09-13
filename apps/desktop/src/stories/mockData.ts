export type Entry = {
	date: string;
	createdAt: string;
	content: string;
	comments: {
		createdAt: string;
		content: string;
	}[];
};

export type PastEntries = { [key: string]: Entry[] };

export type MockStore = {
	pastEntries: PastEntries;
	todayEntries: Entry[];
};

export const mockStore: MockStore = {
	pastEntries: {
		"2023-02-28": [
			{
				date: "2023-02-28",
				createdAt: "2023-02-28T08:30:00Z",
				content:
					"Morning reflection: Starting the day with intention and gratitude. There's something powerful about beginning each morning with a moment of mindfulness, acknowledging the opportunities ahead while appreciating what we already have. Today feels particularly promising as I think about the projects and connections that await.",
				comments: [
					{
						createdAt: "2023-02-28T12:30:00Z",
						content: "This really helped set a positive tone for the day",
					},
				],
			},
			{
				date: "2023-02-28",
				createdAt: "2023-02-28T12:15:00Z",
				content: "Lunch break thoughts on project progress and next steps",
				comments: [],
			},
			{
				date: "2023-02-28",
				createdAt: "2023-02-28T15:45:00Z",
				content: "Interesting conversation with Sarah about work-life balance",
				comments: [],
			},
			{
				date: "2023-02-28",
				createdAt: "2023-02-28T18:20:00Z",
				content:
					"Evening walk observations - noticed the first signs of spring",
				comments: [
					{
						createdAt: "2023-02-28T19:00:00Z",
						content: "The seasons changing always makes me feel hopeful",
					},
				],
			},
			{
				date: "2023-02-28",
				createdAt: "2023-02-28T21:30:00Z",
				content: "Bedtime gratitude: thankful for meaningful connections today",
				comments: [],
			},
		],
		"2023-02-27": [
			{
				date: "2023-02-27",
				createdAt: "2023-02-27T07:45:00Z",
				content:
					"Early morning energy - feeling motivated to tackle new challenges",
				comments: [],
			},
			{
				date: "2023-02-27",
				createdAt: "2023-02-27T11:30:00Z",
				content:
					"Team meeting insights about improving our workflow processes. We spent two hours deep-diving into bottlenecks and inefficiencies, and I'm amazed at how many simple solutions emerged from collaborative thinking. Sometimes the best innovations come from stepping back and questioning assumptions we've held for too long.",
				comments: [
					{
						createdAt: "2023-02-27T14:15:00Z",
						content: "These changes could really streamline our work",
					},
				],
			},
			{
				date: "2023-02-27",
				createdAt: "2023-02-27T14:45:00Z",
				content: "Afternoon coffee break - reconnected with an old friend",
				comments: [],
			},
			{
				date: "2023-02-27",
				createdAt: "2023-02-27T17:00:00Z",
				content: "Wrapping up work with a sense of accomplishment",
				comments: [],
			},
			{
				date: "2023-02-27",
				createdAt: "2023-02-27T20:15:00Z",
				content:
					"Evening reading session - discovered some fascinating ideas about systems thinking and emergence. The author's perspective on how small changes can create cascading effects really resonated with me. I find myself questioning how this applies to both personal growth and organizational change. These concepts feel like they could reshape how I approach problem-solving.",
				comments: [
					{
						createdAt: "2023-02-27T21:00:00Z",
						content: "Need to explore these concepts further tomorrow",
					},
				],
			},
		],
		"2023-02-26": [
			{
				date: "2023-02-26",
				createdAt: "2023-02-26T09:00:00Z",
				content: "Sunday morning peace - enjoying the slower pace",
				comments: [],
			},
			{
				date: "2023-02-26",
				createdAt: "2023-02-26T12:30:00Z",
				content:
					"Family brunch was exactly what I needed this week. There's something magical about gathering around a table with loved ones, sharing stories and laughter over homemade food. These moments remind me what truly matters and help reset my perspective when work feels overwhelming. Connection and presence are the real treasures in life.",
				comments: [
					{
						createdAt: "2023-02-26T13:00:00Z",
						content: "These moments are so precious",
					},
				],
			},
			{
				date: "2023-02-26",
				createdAt: "2023-02-26T15:20:00Z",
				content: "Afternoon creativity session - sketching and brainstorming",
				comments: [],
			},
			{
				date: "2023-02-26",
				createdAt: "2023-02-26T17:45:00Z",
				content: "Garden work - preparing for spring planting season",
				comments: [],
			},
			{
				date: "2023-02-26",
				createdAt: "2023-02-26T19:30:00Z",
				content: "Evening reflection on the week's accomplishments and lessons",
				comments: [
					{
						createdAt: "2023-02-26T20:00:00Z",
						content: "Growth happens in small moments like these",
					},
				],
			},
		],
		"2023-02-25": [
			{
				date: "2023-02-25",
				createdAt: "2023-02-25T08:15:00Z",
				content: "Saturday morning energy boost with a great workout",
				comments: [],
			},
			{
				date: "2023-02-25",
				createdAt: "2023-02-25T11:45:00Z",
				content:
					"Farmers market adventure - found some amazing local produce including the most vibrant heirloom tomatoes and fresh herbs that smell like summer. Chatting with the farmers about their growing practices and seasonal rhythms always inspires me to be more mindful about food choices and supporting sustainable agriculture in our community.",
				comments: [
					{
						createdAt: "2023-02-25T12:15:00Z",
						content: "Supporting local farmers feels so meaningful",
					},
				],
			},
			{
				date: "2023-02-25",
				createdAt: "2023-02-25T14:30:00Z",
				content: "Cooking experiment with new ingredients from the market",
				comments: [],
			},
			{
				date: "2023-02-25",
				createdAt: "2023-02-25T16:00:00Z",
				content:
					"Video call with distant relatives - technology bringing us together",
				comments: [],
			},
			{
				date: "2023-02-25",
				createdAt: "2023-02-25T21:00:00Z",
				content:
					"Movie night selection led to great discussions about storytelling",
				comments: [
					{
						createdAt: "2023-02-25T22:30:00Z",
						content: "Art has such power to connect us to universal themes",
					},
				],
			},
		],
		"2023-02-24": [
			{
				date: "2023-02-24",
				createdAt: "2023-02-24T07:30:00Z",
				content:
					"Friday morning anticipation - looking forward to weekend plans",
				comments: [],
			},
			{
				date: "2023-02-24",
				createdAt: "2023-02-24T10:45:00Z",
				content:
					"Productive meeting with the design team about user experience",
				comments: [
					{
						createdAt: "2023-02-24T11:15:00Z",
						content: "Their insights really opened my perspective",
					},
				],
			},
			{
				date: "2023-02-24",
				createdAt: "2023-02-24T13:20:00Z",
				content: "Lunch with colleagues turned into brainstorming session",
				comments: [],
			},
			{
				date: "2023-02-24",
				createdAt: "2023-02-24T16:30:00Z",
				content: "Afternoon debugging - finally solved that persistent issue",
				comments: [
					{
						createdAt: "2023-02-24T17:00:00Z",
						content: "Sometimes the solution is simpler than we think",
					},
				],
			},
			{
				date: "2023-02-24",
				createdAt: "2023-02-24T19:45:00Z",
				content:
					"End of week celebration - small victories deserve recognition",
				comments: [],
			},
		],
		"2023-02-23": [
			{
				date: "2023-02-23",
				createdAt: "2023-02-23T08:00:00Z",
				content: "Thursday motivation - midweek momentum building",
				comments: [],
			},
			{
				date: "2023-02-23",
				createdAt: "2023-02-23T11:15:00Z",
				content:
					"Client presentation went better than expected - all those late nights preparing really paid off. The client asked thoughtful questions and seemed genuinely excited about our proposed solutions. It's rewarding when thorough preparation meets opportunity, and you can see that your ideas truly resonate with the people you're trying to help.",
				comments: [
					{
						createdAt: "2023-02-23T11:45:00Z",
						content: "Preparation really pays off in these moments",
					},
				],
			},
			{
				date: "2023-02-23",
				createdAt: "2023-02-23T14:00:00Z",
				content: "Learning session about new technologies in our field",
				comments: [],
			},
			{
				date: "2023-02-23",
				createdAt: "2023-02-23T16:45:00Z",
				content: "Mentor conversation provided valuable career guidance",
				comments: [
					{
						createdAt: "2023-02-23T17:15:00Z",
						content: "Wisdom from experience is invaluable",
					},
				],
			},
			{
				date: "2023-02-23",
				createdAt: "2023-02-23T20:30:00Z",
				content: "Evening hobby time - working on personal creative project",
				comments: [],
			},
		],
		"2023-02-22": [
			{
				date: "2023-02-22",
				createdAt: "2023-02-22T07:00:00Z",
				content: "Wednesday wisdom - finding balance in the middle of the week",
				comments: [],
			},
			{
				date: "2023-02-22",
				createdAt: "2023-02-22T10:30:00Z",
				content: "Strategic planning session revealed new opportunities",
				comments: [
					{
						createdAt: "2023-02-22T11:00:00Z",
						content: "Exciting to see the bigger picture taking shape",
					},
				],
			},
			{
				date: "2023-02-22",
				createdAt: "2023-02-22T13:45:00Z",
				content: "Healthy lunch break walk helped clear mental fog",
				comments: [],
			},
			{
				date: "2023-02-22",
				createdAt: "2023-02-22T15:30:00Z",
				content:
					"Collaboration with cross-functional team yielded great results",
				comments: [],
			},
			{
				date: "2023-02-22",
				createdAt: "2023-02-22T18:45:00Z",
				content: "Evening planning session for tomorrow's important tasks",
				comments: [
					{
						createdAt: "2023-02-22T19:15:00Z",
						content: "Organization is the key to reducing stress",
					},
				],
			},
		],
	},
	todayEntries: [
		{
			date: "2023-03-01",
			createdAt: "2023-03-01T08:00:00Z",
			content: "New month energy - March feels full of possibilities",
			comments: [
				{
					createdAt: "2023-03-01T08:30:00Z",
					content: "Ready to embrace new challenges and opportunities",
				},
				{
					createdAt: "2023-03-01T09:00:00Z",
					content: "Excited to see what this month brings",
				},
			],
		},
		{
			date: "2023-03-01",
			createdAt: "2023-03-01T12:30:00Z",
			content: "Midday check-in - staying focused on priorities",
			comments: [],
		},
		{
			date: "2023-03-01",
			createdAt: "2023-03-01T15:15:00Z",
			content: "Interesting development in the afternoon project meeting",
			comments: [
				{
					createdAt: "2023-03-01T15:45:00Z",
					content: "This could change our approach significantly",
				},
			],
		},
		{
			date: "2023-03-01",
			createdAt: "2023-03-01T17:30:00Z",
			content: "End of day reflection on productive conversations",
			comments: [],
		},
	],
};
