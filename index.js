const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const multer = require("multer")


app.use(express.static(path.join(__dirname, "public")));

mongoose.connect("mongodb://127.0.0.1:27017/Dzoni", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Povezani sa bazom podataka")
}).catch(err => {
    console.error("Greska pri povezivanju sa bazom ", err);
})

mongoose.connection.on('error', (err) => {
    console.error("MongoDb konekcija nije uspela:", err);
})

mongoose.connection.on("connected", () => {
    console.log("Mongo konekcija je uspesno uspostavljena")
})

// Postavljanje multer konfiguracije za upload fajlova (koriscenje memorije)
const storage = multer.memoryStorage();
const upload = multer({storage: storage});

const fileSchema = new mongoose.Schema({
    fileName: String,
    fileType: String,
    fileData: Buffer, // cuvanje fajla kao binarni podatak
})

const File = mongoose.model("File", fileSchema);


//POST ruta za upload fajla
app.post("/upload", upload.single("file"), (req, res) => {

    // Provera da li fajl sa istim imenom postoji vec u bazi podataka
    if(req.file) {
        File.findOne({fileName: req.file.originalname})
            .then(existingFile => {
                if(existingFile) {
                    return res.status(400).send("Fajl with same name already exists in database!");
                } else {
                    const newFile = new File({
                        fileName: req.file.originalname,
                        fileType: req.file.mimetype,
                        fileData: req.file.buffer,
                    });

                    newFile.save()
                        .then(() => {
                            res.status(200).send("File has been successfully saved in database.")
                        })
                        .catch(err => {
                            console.log("Error per saving file:", err);
                            res.status(500).send("Error per saving file in database.");
                        })
                }
            })
            .catch(err => {
                console.log("Error per checking file:", err);
                res.status(500).send("Error per checking file");
            })
    } else {
        res.status(400).send("No file for upload");
    }

})

app.get("/documents", async(req, res) => {
    try{
        const files = await File.find(); // Uzimam sve fajlove iz baze
        res.status(200).json(files);
    } catch(err) {
        res.status(500).send("Greska pri citanju iz baze");
    }
})



app.get("/", (req, res) => {
    res.send("Hello backend u Node.js");
})

app.get("/stox", (req, res) => {
    res.send("Ovo je druga najbolja ruta na koju mozes da dodjes");
})

// Ruta za prikaz slike
app.get("/prikaz", (req, res) => {
    // Renderujemo html fajl kada korisnik poseti ovu rutu
    console.log("Ruta /prikaz je pokrenut!")
    res.sendFile(path.join(__dirname, 'public', 'prikaz.html'))
})

app.listen(3000, () => {
    console.log("Server radi na portu http://localhost:3000");
})


