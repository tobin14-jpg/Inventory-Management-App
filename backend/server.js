const dotenv = require("dotenv").config();
const express = require("express"); 
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoute = require("./routes/userRoutes");
const errorHandler = require("./middleWare/errorMiddleware");
const cookieParser = require("cookie-parser");

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(bodyParser.json());

// Routes middleware
app.use("/api/users", userRoute);

// Routes
app.get("/", (req, res) => {
    res.send("Home Page");
})

// Error middleware 
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect to MDB & start server
mongoose.connect(process.env.MONGO_URI).then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    })
}).catch((err) => console.log(err));