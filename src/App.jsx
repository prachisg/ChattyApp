import React, {Component} from 'react';

import Navbar from './Navbar.jsx';
import MessageList from './MessageList.jsx';
import Chatbar from './Chatbar.jsx';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
        currentUser: {name: 'Bob'}, // optional. if currentUser is not defined, it means the user is Anonymous
        messages: [],
        activeUsers: {}
      }

      this.onNewMessage = this.onNewMessage.bind(this);
      this.onNewUser = this.onNewUser.bind(this);

    }

  componentDidMount(){
    const websocket = new WebSocket ('ws://localhost:3001');
    this.socket = websocket;
    websocket.onopen = (event) => {
      console.log('Connected to server', event);
    }

      websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        switch(data.type) {
        case 'incomingMessage':
          // handle incoming message
          console.log('Incoming message', data);
          const incomingMessage = data;
          const messages = this.state.messages.concat(incomingMessage);
          this.setState({messages: messages});
          break;
        case 'incomingNotification':
          // handle incoming notification
          console.log('Incoming noti', data);
          const incomingNotification = data;
          const notifications = this.state.messages.concat(incomingNotification);
          this.setState({ messages: notifications});
          break;
        case 'userCount':
          // const count = data.count;
          this.setState({activeUsers: data});
          break;
        default:
          // show an error in the console if the message type is unknown
          throw new Error('Unknown event type ' + data.type);
      }
    }
    //setupApp(websocket);
  }

  onNewMessage(msg) {
    // if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;
    //console.log('New message', msg.content);
    const newMessage = {type: 'postMessage' , username: msg.name, content: msg.content};
    this.socket.send(JSON.stringify(newMessage));


    // const output = 'User '+ this.state.messages[messages.length - 1].username + ' said ' + this.state.messages[messages.length - 1].content;
    // console.log(output);
    // this.socket.send(output);
  }

  onNewUser(username) {
    const notification = {type: 'postNotification' , content: 'User ' + this.state.currentUser.name + ' has changed their name to User ' + username }
    this.socket.send(JSON.stringify(notification));
    this.setState({currentUser: { name: username}});
  }
// 'User ' + this.state.currentUser.name + ' has changed their name to User ' + username

  render() {
    return (
      <div>
        <Navbar activeUsers = {this.state.activeUsers} />
        <MessageList messages = {this.state.messages} />
        <Chatbar currentUser = {this.state.currentUser}
                 onNewUser = {this.onNewUser}
                 onNewMessage = {this.onNewMessage} />
      </div>
    )
  }
}

// function setupApp(socket) {

// }

function makeId() {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for( var i=0; i < 5; i++ )
      text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

export default App;
