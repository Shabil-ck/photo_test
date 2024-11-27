const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// Middleware to parse JSON body
app.use(bodyParser.json({ limit: '50mb' }));

// POST route to save photo
app.post('/save-photo', (req, res) => {
    const photoData = req.body.photo;
    const base64Data = photoData.replace(/^data:image\/png;base64,/, "");

    // Save the photo in the 'photos' folder with a timestamped filename
    const filePath = path.join(__dirname, 'photos', 'photo-' + Date.now() + '.png');
    fs.writeFile(filePath, base64Data, 'base64', (err) => {
        if (err) {
            console.error('Error saving photo:', err);
            return res.status(500).send('Error saving photo');
        }
        res.json({ message: 'Photo saved successfully', filePath });
    });
});

// Serve static files (like your HTML, CSS, etc.)
app.use(express.static(__dirname));

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
