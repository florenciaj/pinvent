const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const userController = require("./Controller/UserController");
const ErrorHandler = require("./Middleware/ErrorMiddleware");
const cookieParser = require("cookie-parser");

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api/user", userController);

app.use(ErrorHandler);

//routes
app.get("/", (req, res) => {
    res.send("homepage");
});

const PORT = process.env.PORT;

// database connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`server running on port ${PORT}`);
        })
    })
    .catch(error => {
        console.log(error);
    });