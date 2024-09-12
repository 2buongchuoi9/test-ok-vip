const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const compression = require("compression")

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({ origin: "*" }))
app.use(compression()) // nén dữ liệu trước khi gửi đi

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

app.get("/api", async (req, res) => {
    try {
        // Tạo cursor từ truy vấn
        const cursor = RandomData.find({}, { id: 1, value: 1 }).cursor()

        res.setHeader("Content-Type", "application/json")

        // Viết dữ liệu vào response theo từng phần
        res.write("[")
        let isFirst = true

        cursor.on("data", (doc) => {
            if (!isFirst) {
                res.write(",")
            }
            res.write(JSON.stringify(doc))
            isFirst = false
        })

        cursor.on("end", () => {
            res.write("]")
            res.end()
        })

        cursor.on("error", (err) => {
            res.status(500).send("Internal Server Error")
        })
    } catch (err) {
        res.status(500).send("Internal Server Error")
    }
})

app.post("/api", async (req, res) => {
    const { count } = req.body
    let randomData = []
    for (let i = 0; i < count; i++) {
        randomData.push({ value: Math.random().toString(36).substring(7) }) // Tạo giá trị ngẫu nhiên
    }
    await RandomData.insertMany(randomData)
    res.status(200).json("success")
})

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000")
})
