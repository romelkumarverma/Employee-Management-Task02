import express from "express"
import cors from 'cors'
import { adminRouter } from "./Routes/AdminRoute.js"

const app = express()
app.use(cors({
    origin: ["http://localhost:3000"],
    method: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))

app.use(express.json())
app.use('/auth', adminRouter) 
app.use(express.static('public'));

app.listen(5000, () => {
    console.log("Server is running on port 5000...");
})