const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 5777;

app.use(express.static("public"))

app.get("/about", (req, res) => {
    res.sendFile(path.resolve("./public/about.html"))
})

app.get("*", (req, res) => {
    res.status(404)
    res.sendFile(path.resolve("./public/ror.html"))
})

app.listen(PORT, () => {
    console.log(`running on port: ${PORT}`)
})