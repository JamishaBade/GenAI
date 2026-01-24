import Groq from 'groq-sdk';
const groq=new Groq({apiKey:process.env.GROQ_API_KEY});

async function main(){
    const completion=await groq.chat.completions.create({
        model:'llama-3.3-70b-versatile',
        max_completion_tokens:10000, //controls cost and runaway outputs
        frequency_penalty:0.25, //pentaly for repeating tokens
        messages:[
            {
                role:"assistant",
                content:`You are a smart love analyzer lmao. 
                You need to understand love emotions like DEEPLY. 
                You need to understand his emotion in detail.
                Your task is to analyse given review and return the sentiment.  
                Classify the review as He likes me, He doesnt like me, He isnt sure. 
                You must return the result in valid JSON structure.
                example: {"sentiment": " He doesnt like you"}
                `

            },
            {
                role:'user',
                content:`Review: It seems like he likes me but he purposely gives attention to another 
                (i think to show me lowkey because of a misunderstanding about me dating someone else?? maybe?).
                 I see him look at me but then he purposely shows attention to someone else like bro why. 
                 But also because  of the misunderstanding. And i am awkward myself to have a conversation. 
                 We lowkey have similar interests. 
                 Like 90% of the converstation we had was started by him. I am awkward.
                 We have like eye contants lol. Like I feel it like brooo. Do you think he likes me?
                `

            
            }
        ]
    });
    console.log(completion.choices[0].message.content)
}
main();