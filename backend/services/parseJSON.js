function parseJSON(response){

    const clean = response
    .replace(/```json|```/g,"")
    .trim()

    return JSON.parse(clean)

}

export default parseJSON