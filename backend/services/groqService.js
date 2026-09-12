import dotenv from "dotenv"
dotenv.config()

import Groq from "groq-sdk"


const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
})


async function askGroq(prompt){

try {

    const response = await groq.chat.completions.create({

        model:"llama-3.1-8b-instant",

        messages:[
            {
                role:"system",
                content:
                "You are an AI agent. Always return valid JSON only. Never include markdown or explanations."
            },
            {
                role:"user",
                content:prompt
            }
        ],

        temperature:0,

        max_tokens:4000

    })


    const text = response.choices?.[0]?.message?.content


    if(!text){
        throw new Error("Groq returned empty response")
    }


    console.log("RAW GROQ RESPONSE:")
    console.log(text)


    return text


}
catch(error){

    console.log("GROQ ERROR:", error.message)

    throw error

}

}


export default askGroq