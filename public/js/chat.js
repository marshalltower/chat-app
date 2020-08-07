const socket = io()

const $messagesEle = document.querySelector('#messages')
const $messageTemplate = document.querySelector('#message-template').innerHTML

const { username, room} = Qs.parse(location.search, { ignoreQueryPrefix: true})

socket.on('message', (msg) => {
    console.log(msg)
    const html = Mustache.render($messageTemplate, {
        username: msg.username,
        message: msg.text,
        time: moment(msg.createdAt).format('h:mm a')
    })
    $messagesEle.insertAdjacentHTML('beforeend', html)
    autoScroll()
})

const $linkTemplate = document.querySelector('#link-template').innerHTML

socket.on('linkMessage', (link) => {
    console.log(link)
    const html = Mustache.render($linkTemplate, {
        username: link.username,
        url: link.url,
        time: moment(link.createAt).format('h:mm a')
    })
    $messagesEle.insertAdjacentHTML('beforeend', html)
    autoScroll()
})

const $messengerForm = document.querySelector('#messenger')
const $messengerInput = $messengerForm.querySelector('input')
const $messengerBtn = $messengerForm.querySelector('button#send')

$messengerForm.addEventListener('submit', (evt) => {
    evt.preventDefault()
    $messengerBtn.setAttribute('disabled', 'disabled')

    const message = evt.target.elements.message.value

    socket.emit('sendMessage', message, (error) => {
        $messengerBtn.removeAttribute('disabled')
        $messengerInput.value = ''
        $messengerInput.focus()

        if(error) return console.log(error)

        console.log('Message Delivered!')
    })
})

const $locatorBtn = document.querySelector('#locate')
$locatorBtn.addEventListener('click', () => {
    if(!navigator.geolocation) return alert('Geolocation is not supported by your browser')
    $locatorBtn.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        const location = { latitude: position.coords.latitude, longitude: position.coords.longitude}

        socket.emit('sendLocation', location, () => {
            $locatorBtn.removeAttribute('disabled')
            console.log('Location shared!')
        })
    })
})

socket.emit('join', {username, room}, (error) => {
    if(error){
        alert(error)
        location.href = '/'
    }
})

const sidebarTemplate = document.querySelector('#users-template').innerHTML
socket.on('roomPop', ({room, users}) => {
    const html = Mustache.render(sidebarTemplate, {
        room, 
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

const autoScroll = () => {
    const $newMsgEle = $messagesEle.lastElementChild

    const newMsgStyle = getComputedStyle($newMsgEle)
    const newMsgMargin = parseInt(newMsgStyle.marginBottom)
    const newMsgH = $newMsgEle.offsetHeight + newMsgMargin

    const vwH = $messagesEle.offsetHeight

    const containerH = $messagesEle.scrollHeight

    const scrollOffset = $messagesEle.scrollTop + vwH

    if((containerH - newMsgH) <= scrollOffset) $messagesEle.scrollTop = $messagesEle.scrollHeight
}