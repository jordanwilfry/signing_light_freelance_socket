const io = require("socket.io")(4000, {
    cors: {
        origin: "http://localhost:3000",
    },
})

let users = []

const AddUser = (userId, socketId) => {
    console.log(userId);
    console.log(socketId);
    !users.some((user)=> user.userId === userId) &&
        users.push({ userId, socketId })
}

const RemoveUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId)    
}

const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
  };
  
  
io.on("connection", (socket) => {
//when connect

    console.log("A user connected")
    io.emit("welcome", 'hello this my socket server!')
    console.log(users);

    //taking the user_Id front the react application
    socket.on("addUserConect", (userId) => {
        AddUser(userId, socket.id)
        io.emit("getUsers", users)
    })

    //send and get message
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
        const user = getUser(receiverId);
        console.log(receiverId)
        console.log(user)
        io.to(user?.socketId).emit("getMessage", {
        senderId,
        text,
        });
    });


//when disconnect 
    socket.on('disconnect', ()=>{
        console.log('a user have is disconnected')
        RemoveUser(socket.id)
        io.emit("getUsers", users)
    })
})