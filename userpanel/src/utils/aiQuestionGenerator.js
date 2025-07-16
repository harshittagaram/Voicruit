import OpenAI from "openai";

// Check if process.env is available, fallback to a default (for development)
const apiKey = import.meta.env.REACT_APP_OPENROUTER_API_KEY || "your_default_api_key_here";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: apiKey, // Use the resolved API key
  defaultHeaders: {
    // Add any additional headers if required
    // Example: "X-Custom-Header": "value"
  },
});

async function postReq({ jobPosition, jobDescription, duration, type }) {
  try {
    const completion = await openai.chat.completions.create({
      model: "s:Model.GPT-4-omni",
      messages: [
        {
          role: "user",
          content: `Generate interview questions for a ${jobPosition} role with the following description: "${jobDescription}". The interview type is ${type}, and the duration is ${duration}. Provide 3-5 relevant questions.`,
        },
      ],
    });

    const response = completion.choices[0].message.content;
    console.log("AI Response:", response);

    const questions = response
      .split("\n")
      .filter((line) => line.trim())
      .map((line) => line.replace(/^\d+\.\s*/, "").trim());

    return questions.length > 0 ? questions : ["No questions generated."];
  } catch (error) {
    console.error("Error generating questions:", error);
    throw new Error("Failed to generate questions: " + error.message);
  }
}

export { postReq };