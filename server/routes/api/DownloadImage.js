const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.get('/:filename', (req, res) => {
    const {filename} = req.params;

    const filePath = path.join(__dirname, "..", "..", `/public/uploads/${filename}`);

    res.download(filePath, filename);
});

module.exports = router;