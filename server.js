const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors")
dotenv.config();

const {incomingRequestLogger} = require("./middlewares/index.js");
const indexRouter = require("./routes/index");
const userRouter = require("./routes/user.js");
const folderRouter = require("./routes/folder.js");
const formRouter = require("./routes/form.js");

const app = express();
app.use(incomingRequestLogger);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use("/api/v1", indexRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/folder", folderRouter);
app.use("/api/v1/form", formRouter);


app.listen(process.env.PORT, ()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
    mongoose.connect(process.env.MONGODB_URI);
    mongoose.connection.on("error", (err)=>{
        console.log(err);
    });
});