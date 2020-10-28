import io from 'socket.io-client';


//initialize the sockets
const url = 'http://192.168.86.54:3000/';

 export default class NodeSocket {
    static myInstance = null;

    static getInstance() {
      if (NodeSocket.myInstance == null) {
        NodeSocket.myInstance = new NodeSocket();
      }
      return this.myInstance;
    }
    connectSocket = onConnect => {
        this.socket = io(url);
        onConnect();
        // this.socket.on('connect', () => {
        //   console.log('Socket connected...');
        //   onConnect();
        // });    
        this.socket.connect();
      };

sendUserInfo = (userId) => {

    this.socket.emit('storeClientInfo', {
        currentUserId: userId,
    });
    console.log('userInfo sent')
}

getIncomingMessages = (callback) => {


    this.socket.on('incommingMessage', () => {
        console.log('Message coming...');

        callback();
       
    });

    
}

 sentMessageToServer = () => {
    this.socket.emit('newMessage', 'sent');
    console.log('sent!')
}

disconnectUser = (userId) => {
    this.socket.emit('Disconnecting',{
        currentUserId: userId,
    });
    console.log('disconnected ==>', userId)
    
}
 updateUserStatus = (callback) => {
    this.socket.on("update", () => {
        console.log('status updated')
        callback();
    })
}
 }


