const express = require('express');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const app = express();
const PORT = process.env.PORT || 3000;
const cutoff = 75
let previous_response = ""

const {calculateMatchPercentage, query} = require('./utils')

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Create frames directory if it doesn't exist
const framesDir = path.join(__dirname, 'frames');
if (!fs.existsSync(framesDir)) {
    fs.mkdirSync(framesDir);
}

// Endpoint to render the HTML file
app.get('/', (req, res) => {
    res.render('index');
});

// Endpoint to handle frame data
app.post('/upload-frame', (req, res) => {
    const frameData = req.body.frame;

    // Decode base64 image data
    const base64Data = frameData.replace(/^data:image\/jpeg;base64,/, "");

    // Generate a unique filename
    const filename = `frame-${Date.now()}.jpeg`;

    // Path to save the file
    const filePath = `frames/${filename}`

    // Write the file to disk
    fs.writeFile(filePath, base64Data, 'base64', (err) => {
        if (err) {
            console.error('Error saving frame:', err);
            res.status(500).send('Error saving frame');
        } else {
            console.log('Frame saved:', filename);
            // Run predict.py with the saved image as an argument
            query(filePath).then((response) => {

                console.log(JSON.stringify(response));
            }).catch(err=>{
                return res.json()
            })
            // exec(`python3 -W ignore predict.py ${filePath}`, (error, stdout, stderr) => {
            //     if (error) {
            //         console.error(`Error executing predict.py: ${error}`);
            //         return res.status(500).send('Error executing p.py');
            //     }
        
            //     if (stderr) {
            //         console.error(`stderr from predict.py: ${stderr}`);
            //     }
        
            //     // Capture the output in a variable
            //     const output = stdout.toString();
            //     console.log(output);
            //     // Send the output back to the client
            //     // res.send(output);
               
            //     let matchper = calculateMatchPercentage(previous_response, output)
            //     console.log(matchper);
            //     if(matchper>=cutoff){
            //        return res.json({status: "skip"})
            //     }
            //     previous_response = output
            //     return res.json({output, status:"use"});
            // });
        }
    });
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
