const express = require('express');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: '/upload' });

app.use(express.static(path.join(__dirname, 'public')));

app.post('/upload', upload.single('file'), (req, res) => {
    const filePath = req.file.path;

    Tesseract.recognize(filePath,'eng', {
            logger: m => console.log(m)
        }
    ).then(({ data: { text } }) => {
        // işlem tamamlandıktan sonra dosyayı sil
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('File cannot erased:', err);
                return res.status(500).json({ error: 'File cannot erased' });
            }
            console.log('File deleted');
            res.json({ text });
        });
    }).catch(err => {
        // OCR işlemi sırasında bir hata oluşursa dosyayı sil
        fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) {
                console.error('File cannot erased:', unlinkErr);
            }
            res.status(500).json({ error: err.message });
        });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});