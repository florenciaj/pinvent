const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const UserController = require("./Controller/UserController");
const ProductController = require("./Controller/ProductController");
const ErrorHandler = require("./Middleware/ErrorMiddleware");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/upload", express.static(path.join(__dirname, "upload")));

app.use("/api/user", UserController);
app.use("/api/product", ProductController);

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