const express = require('express');
require('dotenv').config();
const appRoute = require('./routes/route');
const mongoose = require('mongoose');
require('./utils/tokenScheduler');
const cors = require('cors');

const PORT = process.env.PORT || 3000;
const app = express();

const corsOptions = {
  origin: 'http://localhost:5173/',
}

app.use(cors(corsOptions));


// EXPRESS MIDDLEWARE 
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL).then(()=> {
  console.log("Connected to the Database...");
}).catch(e => console.log(e.message));


// ROUTES
app.use('/api', appRoute);


// START SERVER
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});