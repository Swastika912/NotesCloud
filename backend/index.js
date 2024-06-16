const connectToMongo = require('./db');
const express = require('express')
const path = require('path')
var cors = require('cors')

connectToMongo()

const app = express()
const port = 5000

app.use(cors())
app.use(express.json())  // if u want to use req.body u have to use this middleware

//available routes
app.use('/api/auth' ,require(path.join(__dirname , "./routes/auth.js")))
app.use('/api/notes' , require(path.join(__dirname , "./routes/notes.js")))




app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`INOTEBOOK BACKEND listening at port ${port}`)
})