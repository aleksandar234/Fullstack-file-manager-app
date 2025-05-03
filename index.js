const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const multer = require("multer")
const User = require("./public/models/User");
const {requireAdmin} = require("./public/middlewares/auth")
const session = require("express-session");

app.use(session({
    secret: "tajna_lozinka",
    resave: true,
    saveUninitialized: true,
    cookie: {secure: false}
}))


// Ovo omogucava da Express parsira podatke iz HTML forme (POST body)
app.use(express.urlencoded({extended:true}));


app.use((req, res, next) => {
    if(req.url.endsWith(".html")) {
        return res.status(404).send("Page not found");
    }
    next();
})


app.use(express.static(path.join(__dirname, "public")));


app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy",
        "default-src 'self';" + // dozvoli sve sa loclhost:3000
        "style-src 'self' 'unsafe-inline'; " + // dozvoli CSS
        "script-src 'self'; " + // dozvoli JS
        "font-src 'self';" + // dozvoli fontove sa localhost
        "img-src 'self' blob: data:;" + // dozvoljava slike
        "object-src 'self' blob: data:;" + // dozvoljava pdf
        "media-src 'self' blob:;" + // dozvoljava medijske fajlove
        "frame-src 'self' blob: data:;"
    );
    next();
})


const bcrypt = require("bcrypt");

mongoose.connect("mongodb://127.0.0.1:27017/Dzoni", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Povezani sa bazom podataka")
}).catch(err => {
    console.error("Greska pri povezivanju sa bazom ", err);
})

// mongoose.connect("mongodb://mongo:IUsudpFUWZOTCehyrIwSSaKQLYobSqlW@maglev.proxy.rlwy.net:48145", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
// .then(() => console.log("Connected to MongoDB on Railway"))
// .catch((err) => console.error("MongoDB connection error:", err));


mongoose.connection.on('error', (err) => {
    console.error("MongoDb konekcija nije uspela:", err);
})

mongoose.connection.on("connected", () => {
    console.log("Mongo konekcija je uspesno uspostavljena")
})

// Postavljanje multer konfiguracije za upload fajlova (koriscenje memorije)
const storage = multer.memoryStorage();
const upload = multer({storage: storage});



async function createAdmin() {
    const hashPassword = await bcrypt.hash("admin", 10);

    const admin = new User({
        email: "admin@gmail.com",
        password: hashPassword,
        role: "ADMIN"        
    })

    await admin.save();
    console.log("Admin has been added to DB");
    mongoose.disconnect();
}

// createAdmin();




const fileSchema = new mongoose.Schema({
    fileName: String,
    fileType: String,
    fileData: Buffer, // cuvanje fajla kao binarni podatak
})

const File = mongoose.model("File", fileSchema);


// Za autorizaciju kada korisnik ode na direktan pristup secondPage.html
app.get("/secondPage", requireAdmin, (req, res) => {
    console.log("Poziva mi se ovo")
    res.sendFile(__dirname + "/public/secondPage.html");
})

// Ovo mi je deo za registraciju 
app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "views/register.html"));
})

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "loginPage.html"));
}) 

// Za redirektovanje rute sa login stranice
app.post("/login", async(req, res) => {
    const {email, password} = req.body;
    
    try{
        const user = await User.findOne({email});
        if(!user) {
            return res.status(401).send("Invalid credentials")
        }

        const isMatch = await bcrypt.compare(password, user.password);
    
        if(!isMatch) {
            return res.status(401).send("Invalid credentials");
        }


        // Ovde cuvamo korisnika u sesiji
        req.session.user = {
            email: user.email,
            role: user.role
        };

        console.log("Sesija je postavljena:", req.session.user);

        res.redirect("/secondPage");
    
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }

})

// Ovo mi je mini ruta za dohvatanje sesija koje trenutno ulogovani korisnik ima
app.get("/session", (req, res) => {
    if(req.session.user) {
        res.json({
            email: req.session.user.email,
            role: req.session.user.role
        })
    } else {
        res.status(401).json({message: "Not authenticated"});
    }
})

// Ovo je za logout
app.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if(err) {
            return res.status(500).send("Could not log out");
        }
        res.redirect("/login");
    })
})

// POST za registraciju accounta
app.post("/register", async(req, res) => {
    console.log("OVde sam")
    const {email, password, conformationPassword} = req.body;

    if(!email || !password || !conformationPassword) {
        return res.status(400).send("All fields are required!");
    }

    if(password !== conformationPassword) {
        return res.status(400).send("Passwords do not match!");
    }

    try {
        const existingUser = await User.findOne({email});
        if(existingUser) {
            return res.status(400).send("Email already exists in database");
        }

        const hashedPassword = await bcrypt.hash(password, 10);


        const newUser = new User({
            email: email,
            password: hashedPassword,
            role: "USER"
        });

        await newUser.save();
        res.redirect("/login");
    } catch(err) {
        console.error("Registration error: ", err);
        res.status(500).send("Server error");
    }

})

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


