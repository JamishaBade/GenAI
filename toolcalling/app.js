import Groq from "groq-sdk";
import { tavily } from "@tavily/core";

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function main() {
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0,
      top_p: 0.3,
      messages: [
        {
          role: "system",
          content: `
        You are an intelligent assistant. 
        If the user asks for real-time information call the 'webSearch' tool.
        Do not answer directly; always use the tool when relevant.`,
        },
        {
          role: "user",
          content: "what is the school fees of lincoln school nepal  for highschoolers?",
        },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "webSearch",
            description: "Search real-time information on the web",
            parameters: {
              type: "object",
              properties: {
                query: { type: "string", description: "Search query" },
              },
              required: ["query"],
            },
          },
        },
      ],
      tool_choice: "auto",
    });

    const message = completion.choices[0].message;
    console.log("Full assistant message:", JSON.stringify(message, null, 2));


    if (message.tool_calls && message.tool_calls.length > 0) {
      for (const tool of message.tool_calls) {
        const params = JSON.parse(tool.function.arguments);
        if (tool.function.name === "webSearch") {
          const result = await webSearch(params);
          console.log(`Assistant (tool result): ${result}`);
        }
      }
    } else if (message.content) {
      console.log(`Assistant: ${message.content}`);
    } else {
      console.log("Assistant returned nothing!");
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

async function webSearch({ query }) {
  console.log("Calling web search for query:", query);
  const response = await tvly.search(query);
  console.log("Raw response:", response);

  // Simplified result
  return `Simulated search result for "${query}"`;
}

main();
