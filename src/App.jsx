import React, {Component} from 'react';

import Navbar from './Navbar.jsx';
import MessageList from './MessageList.jsx';
import Chatbar from './Chatbar.jsx';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
        currentUser: {name: 'Bob', color: ''}, // optional. if currentUser is not defined, it means the user is Anonymous
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
            const incomingMessage = data;
            const messages = this.state.messages.concat(incomingMessage);
            this.setState({messages: messages});
            break;
          case 'incomingNotification':
            // handle incoming notification
            const incomingNotification = data;
            const notifications = this.state.messages.concat(incomingNotification);
            this.setState({ messages: notifications});
            break;
          case 'userCount':
            // Handles the online users count
            this.setState({activeUsers: data});
            break;
          case 'color':
            // Handles color for every user
            this.state.currentUser.color = data.color;
            this.setState(this.state);
            break;
          default:
            // show an error in the console if the message type is unknown
            throw new Error('Unknown event type ' + data.type);
        }
    }
    //setupApp(websocket);
  }

  onNewMessage(msg) {
    const newMessage = {type: 'postMessage' , user: msg.user, content: msg.content};
    this.socket.send(JSON.stringify(newMessage));
  }

  onNewUser(username) {
    const notification = {type: 'postNotification' , content: 'User ' + this.state.currentUser.name + ' has changed their name to User ' + username }
    this.socket.send(JSON.stringify(notification));
     this.state.currentUser.name = username;
    this.setState(this.state);
  }

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

export default App;