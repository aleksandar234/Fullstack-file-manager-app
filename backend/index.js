const express = require("express");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const User = require("./models/User");
const { requireAdmin } = require("./middlewares/auth");
const session = require("express-session");
const cors = require("cors");
const bcrypt = require("bcryptjs");

app.use(cors({
    origin: "http://localhost:5500",
    credentials: true
}));

app.use(session({
    secret: "tajna_lozinka",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader(
        "Content-Security-Policy",
        "default-src 'self'; " +
        "connect-src 'self' http://localhost:5500; " +
        "style-src 'self' 'unsafe-inline'; " +
        "script-src 'self' 'unsafe-inline'; " +
        "font-src 'self'; " +
        "img-src 'self' blob: data:; " +
        "object-src 'self' blob: data:; " +
        "media-src 'self' blob:; " +
        "frame-src 'self' blob: data:;"
    );
    next();
});

mongoose.connect("mongodb://127.0.0.1:27017/Dzoni", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Povezani sa bazom podataka");
}).catch(err => {
    console.error("Greska pri povezivanju sa bazom ", err);
});

mongoose.connection.on("error", (err) => {
    console.error("MongoDb konekcija nije uspela:", err);
});

mongoose.connection.on("connected", () => {
    console.log("Mongo konekcija je uspesno uspostavljena");
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

async function createAdmin() {
    const hashPassword = await bcrypt.hash("admin", 10);

    const admin = new User({
        email: "admin@gmail.com",
        password: hashPassword,
        role: "ADMIN"
    });

    await admin.save();
    console.log("Admin has been added to DB");
    mongoose.disconnect();
}

// createAdmin();

const fileSchema = new mongoose.Schema({
    fileName: String,
    fileType: String,
    fileData: Buffer,
});

const File = mongoose.model("File", fileSchema);

// LOGIN
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        req.session.user = {
            email: user.email,
            role: user.role
        };

        console.log("Sesija je postavljena:", req.session.user);

        return res.status(200).json({
            message: "Login uspesan",
            user: req.session.user
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
});

// SESSION
app.get("/session", (req, res) => {
    if (req.session.user) {
        res.json({
            email: req.session.user.email,
            role: req.session.user.role
        });
    } else {
        res.status(401).json({ message: "Not authenticated" });
    }
});

// LOGOUT
app.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: "Could not log out" });
        }

        console.log("Usao sam u logout");
        res.status(200).json({ message: "Logout uspesan" });
    });
});

// REGISTER
app.post("/register", async (req, res) => {
    console.log("OVde sam");
    const { email, password, conformationPassword } = req.body;

    if (!email || !password || !conformationPassword) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    if (password !== conformationPassword) {
        return res.status(400).json({ message: "Passwords do not match!" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists in database" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email: email,
            password: hashedPassword,
            role: "USER"
        });

        await newUser.save();

        res.status(201).json({ message: "Uspesna registracija" });
    } catch (err) {
        console.error("Registration error: ", err);
        res.status(500).json({ message: "Server error" });
    }
});

// UPLOAD
app.post("/upload", requireAdmin, upload.single("file"), (req, res) => {
    if (req.file) {
        File.findOne({ fileName: req.file.originalname })
            .then(existingFile => {
                if (existingFile) {
                    return res.status(400).json({ message: "Fajl with same name already exists in database!" });
                } else {
                    const newFile = new File({
                        fileName: req.file.originalname,
                        fileType: req.file.mimetype,
                        fileData: req.file.buffer,
                    });

                    newFile.save()
                        .then(() => {
                            res.status(200).json({ message: "File has been successfully saved in database." });
                        })
                        .catch(err => {
                            console.log("Error per saving file:", err);
                            res.status(500).json({ message: "Error per saving file in database." });
                        });
                }
            })
            .catch(err => {
                console.log("Error per checking file:", err);
                res.status(500).json({ message: "Error per checking file" });
            });
    } else {
        res.status(400).json({ message: "No file for upload" });
    }
});

// DOCUMENTS
app.get("/documents", requireAdmin, async (req, res) => {
    try {
        const files = await File.find();
        res.status(200).json(files);
    } catch (err) {
        res.status(500).json({ message: "Greska pri citanju iz baze" });
    }
});

app.get("/stox", (req, res) => {
    res.send("Ovo je druga najbolja ruta na koju mozes da dodjes");
});

app.listen(3000, () => {
    console.log("Server radi na portu http://localhost:3000");
});