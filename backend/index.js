import express, { urlencoded } from "express"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import userRoute from "./routes/user.routes.js"
import postRoute from "./routes/post.routes.js"
import postLikeRoute from "./routes/postLike.routes.js"
import commentRoute from "./routes/comment.routes.js"
import friendRoute from "./routes/friend.routes.js"
import chatRoute from "./routes/chat.routes.js"
import storyRoute from "./routes/story.routes.js"
import http from "http"
import {Server} from "socket.io"

import cors from "cors"

dotenv.config({})


const app = express()
app.use(cookieParser())
app.use(express.json())
app.use(urlencoded({extended:true}))

const corsOptions = {
    origin:'http://localhost:5173',
    credentials:true,

}
app.use(cors(corsOptions))

const PORT = process.env.PORT || 8080

app.use('/api/v1/user',userRoute)
app.use("/api/v1/posts", postRoute);
app.use("/api/v1/post-likes", postLikeRoute);
app.use("/api/v1/comments", commentRoute);
app.use("/api/v1/friends",friendRoute)
app.use("/api/v1/chats",chatRoute)
app.use("/api/v1/stories",storyRoute)


const server  = http.createServer(app)

export const io = new Server(server,{
  cors:{
    origin:"http://localhost:5173",
    credentials:true
  }
})

io.on("connection",(socket)=>{
    console.log("user connected : ", socket.id);
    socket.on("join",(userId)=>{        
        socket.join(userId)
    })
    socket.on("disconnect",()=>{
    console.log("User disconnected")
  })
})


server.listen(PORT,async()=>{
 console.log(`server is listening to port ${PORT}`); 
})