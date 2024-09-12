const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({ origin: "*" }))

mongoose.connect("mongodb+srv://nguyenssk043:anhdaden123@anhdaden-mongodb.t9vlrcj.mongodb.net/test-ok-vip?retryWrites=true&w=majority").then(
    () => {
        console.log("Connected to MongoDB")
    },
    (err) => {
        console.log("Cannot connect to MongoDB", err)
    }
)

// Định nghĩa Schema và Model
const RandomDataSchema = new mongoose.Schema({
    value: String,
})
const RandomData = mongoose.model("RandomData", RandomDataSchema)

app.post("/api", async (req, res) => {
    const { count } = req.body
    let randomData = []
    for (let i = 0; i < count; i++) {
        randomData.push({ value: Math.random().toString(36).substring(7) }) // Tạo giá trị ngẫu nhiên
    }
    await RandomData.insertMany(randomData)
    res.status(200).json("success")
})

app.get("/api", async (req, res) => {
    const data = await RandomData.find().lean()
    res.status(200).json(data)
    console.log(data)
})

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000")
})
