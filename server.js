const express  = require('express')
const { config } = require('dotenv')
const cors = require("cors")
config()


const path = require("path");


const app = express();
const server = require('http').createServer(app)
const io = require('socket.io')(server)

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'public'))
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')
app.use(cors())

let messages = [];

app.use("/", (req, res) => {
    res.render('index.html')
})

io.on('connection', socket => {
    console.log(socket.id)
    socket.emit('previousMessages', messages)
    socket.on('sendMessage', data => {
        messages.push(data);
        socket.broadcast.emit('receivedMessage', data)
    })
})

const PORT = process.env.PORT || 3000
server.listen(PORT, () => console.log(`App is running on port ${PORT}`))