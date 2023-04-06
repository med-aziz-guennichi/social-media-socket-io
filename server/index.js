import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from 'dotenv'
import cors from 'cors'
import AuthRoute from './routes/AuthRoute.js'
import UserRoute from './routes/UserRoute.js'
import PostRoute from './routes/PostRoute.js'
// Images:
import UploadRoute from './routes/UploadRoute.js'
// Chats:
import ChatRoute from "./routes/ChatRoute.js"
import MessageRoute from "./routes/MessageRoute.js"

const app = express();

app.use(express.static('public'))
app.use('/images',express.static("images"))

dotenv.config()

const PORT = process.env.PORT;
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors())

mongoose.connect(process.env.MONGO_DB,{useNewUrlParser:true,useUnifiedTopology:true})
  .then(() =>
    app.listen(PORT, () => console.log(`server is running on port ${PORT}`))
  );


app.use('/auth',AuthRoute)
app.use('/user',UserRoute)
app.use('/post',PostRoute)
app.use('/upload',UploadRoute)
//chats Route:
app.use("/chat",ChatRoute)
app.use('/message',MessageRoute)