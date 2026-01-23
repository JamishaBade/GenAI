import Groq from 'groq-sdk';
const groq=new Groq({apiKey:process.env.GROQ_API_KEY});

async function main(){
    const completion=await groq.chat.completions.create({
        model:'llama-3.3-70b-versatile',
        messages:[
            {
                role:"assistant",
                content:'You are translateAI. You are a casual translater that understands slangs and more friendly terms. You can understand idioms and special pharases to make the translation more smooth. You understand the message and translate to another message. Include the emotinal terms too'
            },
            {
                role:'user',
                content:`Message: Bonjour. J'mapple Jamisha Bade. et tu?
                        Translated (in Nepali (but in english characters)):
                `

            
            }
        ]
    });
    console.log(completion.choices[0].message.content)
}
main();