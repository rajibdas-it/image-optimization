import express from 'express';
import multer, { diskStorage } from 'multer';
import sharp from 'sharp';
import fs from 'fs';

import imagemin from 'imagemin';
import imageminJpegtran from 'imagemin-jpegtran';
import imageminPngquant from 'imagemin-pngquant';




const app = express();


const storage = diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage })


const targetWidth = 1200;
const targetHeight = 800;

const generateFileName = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hour = String(currentDate.getHours()).padStart(2, '0');
    const minute = String(currentDate.getMinutes()).padStart(2, '0');
    const second = String(currentDate.getSeconds()).padStart(2, '0');
    const millisecond = String(currentDate.getMilliseconds()).padStart(3, '0');

    const id = `${year}${month}${day}_${hour}${minute}${second}${millisecond}`;
    return id;
}

app.get('/', async (req, res) => {
    res.send("server running")
})



app.post('/upload', upload.single('file'), async (req, res) => {
    const file = req.file
    console.log(file);


    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const newFileName = generateFileName()

    sharp(`${file.path}`)
        .rotate()
        .resize(1200, 800, {
            fit: 'inside', // Maintain aspect ratio, do not crop
            withoutEnlargement: true // Do not enlarge the image if its dimensions are already less than target
        })
        .jpeg({ quality: 90 }) // set JPEG quality to 80%
        .toFile(`uploads/${newFileName}.jpg`, (err, info) => {
            if (err) {
                console.error(err);
            } else {
                console.log(info);
            }
        });


    // const files = await imagemin([`${file.path}`], {
    //     destination: `uploads/${newFileName}.jpg`,
    //     plugins: [
    //         imageminJpegtran(),
    //         imageminPngquant({
    //             quality: [0.6, 0.8]
    //         })
    //     ]
    // });



    // console.log(files);
    // fs.unlinkSync(file.path)

    // sharp(`${file.path}`)
    //     .resize({ width: 3000, height: 4000 })
    //     .rotate(360)
    //     .toFormat('jpg')
    //     .toFile(`uploads/${newFileName}`)



    res.send("image uploaded successfully")
})



// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
