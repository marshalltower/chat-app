const users = []

const addUser = (id, username, room) => {
    const usernameClean = username.trim().toLowerCase()
    const roomClean = room.trim().toLowerCase()

    if(!usernameClean || !roomClean) return { error: 'Username and room are required'}

    const existingUser = users.find((user) => {
        return (user.room === roomClean && user.username === usernameClean)
    })
    if(existingUser) return { error: 'Username is in use!'}

    const user = {id, username: usernameClean, room: roomClean}
    users.push(user)

    return {user}
}

const removeUser = (id) => {
    const idx = users.findIndex((user) => user.id === id)

    if(idx !== -1) return users.splice(idx, 1)[0]
}

const getUser = (id) => {
    return users.find((user) => user.id === id)
}

const getUsersInRoom = (room) => {
    return users.filter((user) => user.room === room)
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}