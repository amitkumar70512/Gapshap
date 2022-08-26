const socket = io()
var name;
let textarea = document.querySelector('#textarea')
let messageArea = document.querySelector('.message__area')
var audio = new Audio('tone.mp3')

const d = new Date();
var h=0,m=0,t=0;
function get_time()
{
    console.log(d.getTime());
 h = (d.getUTCHours()+5)%12;
 m=d.getUTCMinutes();
if(m>29)h++;
m = (d.getUTCMinutes()+30)%60;
t=h+":"+m;
}

 
get_time()

do {
    name = prompt('Please enter your name: ')
} while(!name)
let onjoin = {
    user: `${name}`,
    message: `${name} joined the gapshap.`,
    time: t
    
}
socket.emit('joined',onjoin)

function send(){
    document.getElementById("typingText").style.visibility="hidden";
    sendMessage(document.getElementById("textarea").value);
    document.getElementById("textarea").value="";
}
// textarea.addEventListener('keyup', (e) => {
//     if(e.key === 'Shift') {
//         sendMessage(e.target.value)
//     }
// })


function typing(){
    // Send to server  i am typing
    socket.emit('typing');
}

function sendMessage(message) {
    get_time();
    console.log(t);
    let msg = {
        user: name,
        message: message.trim(),
        time: t
        
    }
    // Append 
    appendMessage(msg, 'outgoing')
    textarea.value = ''
    scrollToBottom()
    socket.emit('stoptyping')
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
  
    appendMessage(msg, 'incoming')
    audio.play();
    
    scrollToBottom()
})


function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight
}


// typing
socket.on('typing',()=>{
    document.getElementById("typingText").style.visibility="visible";
})

socket.on('stoptyping',()=>{
    document.getElementById("typingText").style.visibility="hidden";
})