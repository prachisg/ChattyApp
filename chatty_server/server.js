const express = require('express');
const SocketServer = require('ws').Server;
const uuidV3 = require('uuid');

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Created the WebSockets server
const wss = new SocketServer({ server });

let sharedContent = '';

let arraycolor = ['#a3fd7f', '#FFFF00', '#800000', '#2980B9'];

//  The callback function handles connection
wss.on('connection', (ws) => {
  let newColor = arraycolor.pop();
  if(!newColor) {
    arraycolor = ['#a3fd7f', '#FFFF00', '#800000', '#2980B9'];
    newColor = arraycolor.pop();
  }
  const color = {type: 'color', color: newColor};
  ws.send(JSON.stringify(color));
  const activeUsers = { 'type': 'userCount', 'count': wss.clients.size };
  sharedContent = activeUsers;
  broadcast(sharedContent);

// The callback function in on('message') handles incoming message
  ws.on('message',(clientData) => {
    const data = JSON.parse(clientData);



    switch(data.type) {
      case 'postMessage':
        //Handle the postmessage from the client
        data.type = 'incomingMessage';
        data.id = uuidV3();   //Assigning id to the incoming message
        sharedContent = data;
        broadcast(sharedContent);
      break;
      case 'postNotification':
        // handle post notification from client
        data.type = 'incomingNotification';
        sharedContent = data;
        broadcast(sharedContent);
        break;
      default:
        // show an error in the console if the message type is unknown
        throw new Error('Unknown event type ' + data.type);
    }
  })
  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {
     const activeUsers = { 'type': 'userCount', 'count': wss.clients.size };
     sharedContent = activeUsers;
     broadcast(sharedContent);
  });
});

//Broadcasts the message to all the clients
function broadcast(data){
  for (let client of wss.clients){
    client.send(JSON.stringify(data));
  }
}
