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


var h=0,m=0,t=0;
function get_time()
{
    var d = new Date();
    h = (d.getUTCHours()+5)%12;
    m=d.getUTCMinutes();
    if(m>29)h++;
    m = (d.getUTCMinutes()+30)%60;
    t=h+":"+m;
}
 
get_time()


io.on('connection', (socket) => {
    
    socket.on('joined',(onjoin)=>
    {
        users[socket.id]=onjoin.user;
      
        socket.broadcast.emit('message',onjoin)
    })


    socket.on('message', (msg) => {
        get_time()
        let text = {
            user: msg.user,
            message: msg.message,
            time: t
            
        }
        socket.broadcast.emit('message', msg)
    })
    
    socket.on('typing',()=>{
        socket.broadcast.emit('typing')
    })
    socket.on('stoptyping',()=>{
        socket.broadcast.emit('stoptyping')
    })

    socket.on('disconnect',()=>{
        
        let msg = {
            user: '',
            message: `${users[socket.id]} left the chat`,
            time: ''
            
        }
        socket.broadcast.emit('message',msg)
    })


})
