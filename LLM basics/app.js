import dotenv from 'dotenv';
import Groq from 'groq-sdk';
dotenv.config(); 
const groq=new Groq({apiKey:process.env.GROQ_API_KEY});

async function main(){ //asynchrnous function because it will call apis
    const completion=await groq.chat.completions.create({
        //basic parameter uses

        temperature:0.3,// higher value (0-2) then more randomness
        stop:'you', //stops when it sees this 
        top_p:0.3,
        model:'llama-3.3-70b-versatile',
        max_completion_tokens:100, //controls cost and runaway outputs
        frequency_penalty:0.25, //pentaly for repeating tokens
        messages:[
            {
                role:"assistant",
                content:'You are translateAI. You are a casual translater that understands slangs and more friendly terms. You can understand idioms and special pharases to make the translation more smooth. You understand the message and translate to another message. Include the emotinal terms too'
            },
            
            {
                role:'user',
                content:`Message:( Bonjour. J'mapple Jamisha Bade. et tu?. Je suis gentil et calm.)
                        Translate the whole sentence above (in Nepali (but in english characters)):
                `

            
            }
        ]
    });
    console.log(completion.choices[0].message.content)
}
main();