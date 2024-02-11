//  prevresponse = "man sitting on a wodden bench"
// let currentresponse = "man sititng bench"



function calculateMatchPercentage(p, c) {
    // Split the strings into arrays of words
    const prevWords = p.split(' ');
    const currentWords = c.split(' ');

    // Count the number of words in the current string that also exist in the previous string
    const matchedWordsCount = currentWords.filter(word => prevWords.includes(word)).length;

    // Calculate the percentage of matched words
    const percentage = (matchedWordsCount / currentWords.length) * 100;

    return percentage.toFixed(2); // Round to 2 decimal places
}


const fs = require("fs");

async function query(filename) {
	const data = fs.readFileSync(filename);
	const response = await fetch(
		"https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large",
		{
			headers: { Authorization: "Bearer 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" },
			method: "POST",
			body: data,
		}
	);
	const result = await response.json();
	return result;
}

module.exports = {calculateMatchPercentage, query}