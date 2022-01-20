const socket = io()
let name;
let textarea = document.querySelector('#textarea')
let messageArea = document.querySelector('.message__area')
var audio = new Audio('tone.mp3')

const d = new Date();
let h,m;
function get_time()
{
 h = (d.getUTCHours()+5)%12;
 m=d.getUTCMinutes();
if(m>29)h++;
}

 m = d.getUTCMinutes()+30%60;

let time=h+":"+m;
do {
    name = prompt('Please enter your name: ')
} while(!name)
let onjoin = {
    user: `${name}`,
    message: `${name} joined the gapshap.`,
    time: time
    
}
socket.emit('joined',onjoin)


textarea.addEventListener('keyup', (e) => {
    if(e.key === 'Enter') {
        sendMessage(e.target.value)
    }
})

function sendMessage(message) {
    get_time();
    let msg = {
        user: name,
        message: message.trim(),
        time: time
        
    }
    // Append 
    appendMessage(msg, 'outgoing')
    textarea.value = ''
    scrollToBottom()

    // Send to server 
    socket.emit('message', msg)

}

function appendMessage(msg, type) {
    let mainDiv = document.createElement('div')
    let className = type
    mainDiv.classList.add(className, 'message')

    let markup = `
        <h4>${msg.user}</h4>
        <p>${msg.message}</p>
        <h6>${msg.time}</h6>
    `
    mainDiv.innerHTML = markup
    messageArea.appendChild(mainDiv)
    
    
}

// Recieve messages 
socket.on('message', (msg) => {
    get_time();
    appendMessage(msg, 'incoming')
    audio.play();
    
    scrollToBottom()
})

function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight
}


