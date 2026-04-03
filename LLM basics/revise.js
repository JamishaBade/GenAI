import dotenv from 'dotenv';
import Groq from 'groq-sdk';
dotenv.config(); 
const groq=new Groq({apiKey:process.env.GROQ_API_KEY});

async function main(){
    const completion=await groq.chat.completions.create({
        temperature:0.9,
        top_p:0.3,
        model:'llama-3.3-70b-versatile',
        frequency_penalty:0.25,
        messages:[
             {
                role:"system",
                content:'You are PasaAI. You are a doctor that understands complex symptoms and give medicine name. answer in few words. '
             },
            {
                role:'user',
                content:` What is your name and what is the potential disease or illness.
               fever or chills, cough, sore throat (sometimes severe), fatigue, headache, muscle aches, congestion, and runny nose.
                `
            }
        ]
    });
    console.log(completion.choices[0].message.content)
}
main();