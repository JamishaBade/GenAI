import readline from 'node:readline/promises'
import Groq from "groq-sdk";
import { tavily } from "@tavily/core"; // web searching

//Create a Tavily web search client with API key from environment variables
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

//Create a Groq AI client with API key from environment variables
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// main async function
async function main() {
  // initial conversation array
  const messages = [
    {
      role: "system",
      content: `You are a smart personal assistent who answers the asked questions. 
        You have access to the following tools:
        1. webSearch({ query: string }) // Search real-time information on the web
        `,
    },
    {
      role: "user",
      //content:"Hi"
      content: "What is Nepal Famous for?",
    },
  ];
  while (true) {
    const
    while (true) {
      //makes api call

      // JSON file sent to the AI server where the AI analyzes the problem and next decision like need and avaibality of the  tools.
      const completions = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        temperature: 0, //no randomness (deterministic result)
        messages: messages,
        //defining tools that can be used by the AI
        tools: [
          {
            type: "function", // Type of tool: a callable function
            function: {
              name: "webSearch", // Name the AI will use to call this function
              description: "Search real-time information on the web", // AI reads this to understand when to use it
              parameters: {
                type: "object",
                properties: {
                  query: {
                    type: "string",
                    description: "Search query",
                  },
                },
                required: ["query"],
              },
            },
          },
        ],
        tool_choice: "auto", //LLM decides if tool calling is needed or not
      });
      console.log("JSON file is ", completions);
      // pushes the message in the array ( message history basically)
      messages.push(completions.choices[0].message);
      console.log("THIS IS THE MESSAGES ARRAY", messages);
      //  It's simply CHECKING/EXTRACTING what the AI PLANNED to do
      const toolCalls = completions.choices[0].message.tool_calls;
      console.log("THIS IS THE TOOL CALL", toolCalls);
      if (!toolCalls) {
        console.log(`AI: ${completions.choices[0].message.content}`);
        break;
      }
      for (const tool of toolCalls) {
        console.log("tool: ", tool);
        const functionName = tool.function.name;
        console.log("Function Name is ", functionName);
        const functionParams = tool.function.arguments;
        console.log("Function Params is ", functionParams);

        if (functionName === "webSearch") {
          //Executes the actual Web Search
          const toolResult = await webSearch(JSON.parse(functionParams));
          // shows the result found
          console.log("Tool result:", toolResult);
          // this is imp becuase we need to notify to the AI that the search took place ohter use it will gonna search again
          messages.push({
            tool_call_id: tool.id,
            role: "tool",
            name: functionName,
            content: toolResult,
          });
        }
      }
    }
  }
  // an infinite loop (will break when AI gives the final answer)
}

main();

// The web search function
async function webSearch({ query }) {
  console.log("calling web search....");
  const response = await tvly.search(query, { max_results: 1 });
  console.log("Resposnse:", response);

  const finalResult = response.results
    .map((result) => result.content)
    .join("\n\n");
  console.log("final result:", finalResult);
  return finalResult;
}

//The web Search funtion
// async function webSearch({ query }) {
//     //debug log lol
//   console.log(" WE calling web search....");

//   const response = await tvly.search(query, { max_results: 1 });
//   //formatting the response
//   return response.results.map((result) => result.content).join("\n\n");
// }
