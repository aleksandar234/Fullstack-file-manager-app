// const mongoose = require('mongoose');

// // Povezivanje sa mongoDB bazom podataka (ovde koristimo MongoDB Atlas URL)
// mongoose.connect('mongodb://localhost:27017/Dzoni', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
// .then(() => {
//     console.log("Uspesno poveza sa bazom");
// })
// .catch(err => {
//     console.error("Greska pri povezivanju sa bazom:", err);
// })


const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/Dzoni';

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("Uspesno povezan sa bazom");
})
.catch(err => {
    console.error("Greska pri povezivanju sa bazom:", err);
});