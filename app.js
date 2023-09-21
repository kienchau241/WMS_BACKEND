const express = require('express');
const morgan = require('morgan')
const bodyParser = require("body-parser");

const app = express();
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req,res)=>{
    res.status(200).json({
        test:"Test API nef"
    })
})

const userRoute = require("./src/Routes/userRoutes");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/v1/user", userRoute)

module.exports = app;