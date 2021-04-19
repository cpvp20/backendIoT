const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const URI = process.env.MONGO_URL;
mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("Connected to database");
}).catch((err)=>{
    console.log("Not connected to database", err);
});

module.exports = mongoose;
