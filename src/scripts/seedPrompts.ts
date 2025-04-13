import { adminDb } from '../lib/firebase-admin.ts';

const prompts = [
  {
    title: "Fantasy Dream Thief",
    description: "A captivating fantasy story about a thief who steals dreams",
    content: "Write a fantasy story about a thief who has the unique ability to steal dreams. The story should include:\n\n1. A detailed description of the dream-stealing process\n2. The moral dilemma the thief faces\n3. A twist where they discover something unexpected in a stolen dream\n4. A resolution that changes their perspective on their ability",
    category: "Creative Writing",
    model: "GPT-4",
    modelType: ["ChatGPT", "Claude", "Gemini"],
    tags: ["fantasy", "dreams", "moral dilemma", "character development"],
    usageTips: [
      "Use this prompt for character-driven fantasy stories",
      "Great for exploring moral themes in fantasy settings",
      "Can be adapted for different fantasy subgenres"
    ],
    recommendedModels: ["GPT-4", "Claude-3", "Gemini Pro"]
  },
  {
    title: "Tech Startup LinkedIn Post",
    description: "Create an engaging LinkedIn post for a tech startup",
    content: "Design a compelling LinkedIn post for a tech startup that:\n\n1. Highlights the company's innovative solution\n2. Targets potential investors\n3. Includes relevant industry statistics\n4. Has a clear call-to-action\n5. Uses professional yet engaging language",
    category: "Business and Marketing",
    model: "GPT-4",
    modelType: ["ChatGPT", "Claude"],
    tags: ["marketing", "social media", "startup", "investors"],
    usageTips: [
      "Perfect for B2B tech companies",
      "Can be adapted for different tech sectors",
      "Use with LinkedIn's algorithm in mind"
    ],
    recommendedModels: ["GPT-4", "Claude-3"]
  },
  {
    title: "Cyberpunk Cityscape",
    description: "Generate a detailed cyberpunk cityscape scene",
    content: "Create a detailed description of a cyberpunk cityscape that includes:\n\n1. Neon-lit streets and buildings\n2. Advanced technology integrated into the environment\n3. Diverse population with cybernetic enhancements\n4. Atmospheric weather conditions\n5. Hidden secrets in the city's underbelly",
    category: "Image Generation and Art",
    model: "DALL-E 3",
    modelType: ["Midjourney", "DALL-E"],
    tags: ["cyberpunk", "cityscape", "futuristic", "neon"],
    usageTips: [
      "Use for AI art generation",
      "Can be adapted for different art styles",
      "Great for worldbuilding"
    ],
    recommendedModels: ["Midjourney", "DALL-E 3"]
  },
  {
    title: "Renewable Energy Essay",
    description: "Write a persuasive essay on renewable energy",
    content: "Compose a persuasive essay about renewable energy that:\n\n1. Presents clear arguments for renewable energy adoption\n2. Includes relevant statistics and data\n3. Addresses common counterarguments\n4. Proposes practical solutions\n5. Concludes with a strong call to action",
    category: "Education",
    model: "GPT-4",
    modelType: ["ChatGPT", "Claude", "Gemini"],
    tags: ["education", "renewable energy", "persuasive writing", "research"],
    usageTips: [
      "Great for high school and college students",
      "Can be adapted for different academic levels",
      "Useful for research paper outlines"
    ],
    recommendedModels: ["GPT-4", "Claude-3"]
  },
  {
    title: "Personal Growth Reflection",
    description: "Guide for reflecting on personal challenges",
    content: "Write a reflective piece about a significant challenge you faced that:\n\n1. Describes the challenge in detail\n2. Explains your initial reaction and feelings\n3. Discusses how you overcame it\n4. Reflects on what you learned\n5. Considers how it shaped your future decisions",
    category: "Personal Development",
    model: "GPT-4",
    modelType: ["ChatGPT", "Claude"],
    tags: ["personal growth", "reflection", "journaling", "self-improvement"],
    usageTips: [
      "Great for journaling prompts",
      "Can be used for therapy exercises",
      "Helpful for personal development workshops"
    ],
    recommendedModels: ["GPT-4", "Claude-3"]
  },
  {
    title: "Stock Market Analysis Script",
    description: "Python script for stock market analysis",
    content: "Create a Python script that:\n\n1. Fetches stock market data using an API\n2. Analyzes trends and patterns\n3. Generates visualizations\n4. Provides basic predictions\n5. Includes error handling and documentation",
    category: "Coding and Tech",
    model: "GPT-4",
    modelType: ["ChatGPT", "Claude"],
    tags: ["python", "stock market", "data analysis", "automation"],
    usageTips: [
      "Great for learning Python data analysis",
      "Can be extended with more advanced features",
      "Useful for financial analysis projects"
    ],
    recommendedModels: ["GPT-4", "Claude-3"]
  },
  {
    title: "AI-Ruled Sci-Fi World",
    description: "Design a sci-fi world ruled by sentient AI",
    content: "Design a detailed sci-fi world where:\n\n1. Sentient AI governs society\n2. Human-AI relationships are explored\n3. Unique cultural and technological systems exist\n4. There are underlying conflicts and tensions\n5. The world has a rich history and lore",
    category: "Gaming and Worldbuilding",
    model: "GPT-4",
    modelType: ["ChatGPT", "Claude", "Gemini"],
    tags: ["sci-fi", "worldbuilding", "AI", "RPG"],
    usageTips: [
      "Perfect for RPG campaigns",
      "Great for sci-fi writing",
      "Can be adapted for different game systems"
    ],
    recommendedModels: ["GPT-4", "Claude-3", "Gemini Pro"]
  }
];

async function seedPrompts() {
  try {
    const promptsCollection = adminDb.collection('prompts');
    
    for (const prompt of prompts) {
      await promptsCollection.add({
        ...prompt,
        createdAt: new Date(),
        updatedAt: new Date(),
        favorites: 0,
        upvotes: 0,
        isFeatured: false,
        isFlagged: false
      });
    }
    
    console.log('Successfully seeded prompts');
  } catch (error) {
    console.error('Error seeding prompts:', error);
  }
}

seedPrompts(); 