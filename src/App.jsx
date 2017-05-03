import React, {Component} from 'react';

import Navbar from './Navbar.jsx';
import MessageList from './MessageList.jsx';
import Chatbar from './Chatbar.jsx';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
        currentUser: {name: 'Bob'}, // optional. if currentUser is not defined, it means the user is Anonymous
        messages: [
          // { id: makeId(),
          //   username: 'Bob',
          //   content: 'Has anyone seen my marbles?'
          // }
          // { id: makeId(),
          //   username: 'Anonymous',
          //   content: 'No, I think you lost them. You lost your marbles Bob. You lost them for good.'
          // }
        ]
      }

      this.onNewMessage = this.onNewMessage.bind(this);
    }

  componentDidMount(){
    const websocket = new WebSocket ('ws://localhost:3001');
    this.socket = websocket;
    websocket.onopen = (event) => {
      console.log('Connected to server', event);
    }
    //setupApp(websocket);
  }

  onNewMessage(msg) {
    //console.log('New message', msg.content);
    const newMessage = {id: makeId(), username: msg.name, content: msg.content};
    this.socket.send(JSON.stringify(newMessage));
    const messages = this.state.messages.concat(newMessage)
    this.setState({messages: messages})

    // const output = 'User '+ this.state.messages[messages.length - 1].username + ' said ' + this.state.messages[messages.length - 1].content;
    // console.log(output);
    // this.socket.send(output);
  }


  render() {
    return (
      <div>
        <Navbar/>
        <MessageList messages = {this.state.messages}/>
        <Chatbar currentUser = {this.state.currentUser}
                 onNewMessage = {this.onNewMessage}/>
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
