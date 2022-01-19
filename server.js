const express = require('express')
const app = express()
const http = require('http').createServer(app)

const PORT = process.env.PORT || 3000

http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

// Socket 
const io = require('socket.io')(http)


const users={};


io.on('connection', (socket) => {
    console.log('Connected...')
    socket.on('joined',(onjoin)=>
    {
        users[socket.id]=onjoin.user;
        socket.broadcast.emit('message',onjoin)
    })


    socket.on('message', (msg) => {
        socket.broadcast.emit('message', msg)
    })

    socket.on('disconnect',()=>{
        console.log("inside dissconnect");
        
        let msg = {
            user: '',
            message: `${users[socket.id]} left the chat`,
            time: ''
            
        }
        socket.broadcast.emit('message',msg)
    })


})
