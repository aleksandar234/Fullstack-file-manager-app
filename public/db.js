const mongoose = require('mongoose');

// Povezivanje sa mongoDB bazom podataka (ovde koristimo MongoDB Atlas URL)
mongoose.connect('mongodb://localhost:27017/Dzoni', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("Uspesno poveza sa bazom");
})
.catch(err => {
    console.error("Greska pri povezivanju sa bazom:", err);
})