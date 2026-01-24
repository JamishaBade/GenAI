import Groq from "groq-sdk"; // Import the Groq class to interact with Groq's AI models
import { tavily } from "@tavily/core"; // Import tavily function for web searching capabilities

// Initialize API clients with API keys from environment variables
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY }); // Create Tavily web search client
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY }); // Create Groq AI client

// Main function: async because it performs network requests (API calls)
async function main() { // Asynchronous function because we need to wait for API responses
  try { // try-catch block to handle potential errors gracefully without crashing
    // Make API call to Groq's chat completion endpoint and wait for response
    const completion = await groq.chat.completions.create({ // 'completion' stores the API response
      // Model configuration
      model: "llama-3.3-70b-versatile", // Specifies which AI model to use (70B parameter Llama 3.3)
      temperature: 0, // Controls randomness: 0 = deterministic, always same output for same input
      top_p: 0.3, // Nucleus sampling: 0.3 = consider only top 30% probable words
      
      // Conversation history (message array)
      messages: [
        {
          role: "system", // System message sets behavior/instructions for the AI
          content: `
        You are an intelligent assistant. 
        If the user asks for real-time information call the 'webSearch' tool.
        Do not answer directly; always use the tool when relevant.`,
          // ↑ Critical instruction: Forces AI to use web search for current info
        },
        {
          role: "user", // User message contains the actual query/question
          content: "what is the school fees of lincoln school nepal for highschoolers?",
          // ↑ This triggers the AI to recognize need for real-time information
        },
      ],
      
      // Tool definitions: Functions the AI can call
      tools: [
        {
          type: "function", // Type of tool: a callable function
          function: {
            name: "webSearch", // Name the AI will use to call this function
            description: "Search real-time information on the web", // AI reads this to understand when to use it
            parameters: { // Define what parameters the function expects
              type: "object", // Parameters are passed as an object
              properties: { // Properties of that object
                query: { 
                  type: "string", // Must be a string
                  description: "Search query", // Helps AI understand what to put here
                },
              },
              required: ["query"], // 'query' parameter is mandatory
            },
          },
        },
      ],
      tool_choice: "auto", // Let AI decide whether to use tools: "auto", "none", or "required"
    });

    // Extract the assistant's message from the first choice in the response
    const message = completion.choices[0].message;
    
    // Debug: Log the full message structure in readable JSON format (2-space indentation)
    console.log("Full assistant message:", JSON.stringify(message, null, 2));

    // Check if the AI decided to use tools (function calls)
    if (message.tool_calls && message.tool_calls.length > 0) {
      // Loop through each tool call the AI requested
      for (const tool of message.tool_calls) {
        // Parse the arguments from JSON string to JavaScript object
        const params = JSON.parse(tool.function.arguments);
        
        // Check which tool was called
        if (tool.function.name === "webSearch") {
          // Execute the webSearch function with the AI-provided parameters
          const result = await webSearch(params);
          // Display the search result
          console.log(`Assistant (tool result): ${result}`);
        }
        // Future: Add more tool handlers here (e.g., database queries, calculations)
      }
    } else if (message.content) {
      // If AI responded with direct content (no tool calls), display it
      console.log(`Assistant: ${message.content}`);
    } else {
      // Edge case: AI returned neither tool calls nor content
      console.log("Assistant returned nothing!");
    }
  } catch (err) {
    // Catch any errors from: network issues, API failures, JSON parsing, etc.
    console.error("Error:", err);
    // Note: Could add retry logic, fallback, or notifications here
  }
}

// webSearch function: Executes actual web search using Tavily API
async function webSearch({ query }) { // Destructure query from parameters object
  console.log("Calling web search for query:", query); // Log what we're searching
  
  // Make API call to Tavily search and wait for response
  const response = await tvly.search(query);
  
  // Debug: Log raw response from Tavily
  console.log("Raw response:", response);
  
  // CURRENTLY SIMPLIFIED: Returns placeholder instead of processing actual results
  // TODO: Extract and format actual search results from 'response' object
  return `Simulated search result for "${query}"`;
  
  /* Example of processing actual results:
  const results = response.results.map(r => r.content).join('\n');
  return `Search results for "${query}":\n${results}`;
  */
}

// Entry point: Start the program
main(); // Call the main function to begin execution