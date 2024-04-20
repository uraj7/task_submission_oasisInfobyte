// here we are working with node js hence insted of import we use require
const express = require('express')
const app = express()
const port = 5000
const mongoDB = require("./db")

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//mongoDB();  // yaha se call kar rahe hai (declared in db)
app.use((req,res,next)=>{
  res.setHeader("Access-Control-Allow-Origin","http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
})
app.get('/', (req, res) => { 
  res.send('Hello World!------')
})

app.use('/api',require("./Routes/CreatUser"));  //meddlewere
app.use('/api',require("./Routes/DisplayData"));
app.use('/api',require("./Routes/OrderData"));
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})  