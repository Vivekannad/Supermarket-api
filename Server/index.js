const express = require('express');
const { errorHandler } = require('./middlewares/errorHandler');
const { initDB } = require('./data/init.js');
const router = require('./routes/route.js');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 3000;


// for parsing application/json
app.use(express.json());
app.use(cors());

//testing route
app.get('/', async (req, res) => {
    res.json({message : "Hello World"});
});

app.use("/api" , router);

// error handling middleware
app.use(errorHandler);


app.listen(port, async() => {
  try {
    await initDB();
    
  }catch(err) {
    console.error(err);
  }
  console.log(`Auth system listening at http://localhost:${port}`);
});