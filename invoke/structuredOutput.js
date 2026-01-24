import Groq from 'groq-sdk';
const groq=new Groq({apiKey:process.env.GROQ_API_KEY});

async function main(){
    const completion=await groq.chat.completions.create({
        model:'llama-3.3-70b-versatile',
      // For json_object format (a structured output)
        response_format:{type:'json_object'}, 
        messages:[
            {
                role:"assistant",
                content:`You are a smart business analyzer 
                You need to fetch data of businesses from public records.
                You need to analyze the validity of the business.
                You need to find out monthly revenue.
                Your task is to analyse the information and return the data.  
                `

            },
            {
                role:'user',
                content:`
                The business you need to analyze is SpaceX, Duolingo, Calai 
                 you must return JSON object only like this:
                 example: {"name": "Microsoft", "revenue":"100000000 dollars/month", "CEO":"Bill gates"}
                `

            
            }
        ]
    });
    console.log(completion.choices[0].message.content)
}
main();