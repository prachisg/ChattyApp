import React, {Component} from 'react';

class Chatbar extends Component {

  constructor() {
    super();

    // this.state = {
    //   message: ''
    //   // userName: {this.props.currentUser.name }
    // }

    this.onKeyPress = this.onKeyPress.bind(this);
  }

  onKeyPress(e){
    if (e.key === 'Enter') {
      console.log('Enter pressed');
      this.props.onNewMessage({name: this.props.currentUser.name, content: e.target.value});
      e.target.value = "";
    }

  }
  render() {
    return (
      <footer className="chatbar">
        <input className="chatbar-username" defaultValue= {this.props.currentUser.name}/>
        <input className="chatbar-message" placeholder="Type a message and hit ENTER" onKeyPress={this.onKeyPress} />
      </footer>
    )
  }
}

export default Chatbar;