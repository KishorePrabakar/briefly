const express = require('express');
const app = express();
const port = 3000;

app.get('/health', (req, res) => {
  res.status(200).json({"status":"active"});
})

app.get('/audio', (req, res) => {
  console.log("Waiting for audio...");
  
})

app.listen(port, ()=>{
  console.log(`The app is running on port ${port}`);
})