import React, {createRef} from 'react';

class App extends React.Component {
  state = {
    text: '',
    username: 'Anonymous',
    messages: [],
    coordinates: '',
  };

  componentDidMount() {
    this.websocket = new WebSocket('ws://localhost:8000/chat');

    this.websocket.onmessage = (message) => {
      try {
        const data = JSON.parse(message.data);

        if (data.type === 'NEW_MESSAGE') {
          const newMessage = {
            username: data.username,
            text: data.text
          };

          this.setState({messages: [...this.state.messages, newMessage]})
        } else if (data.type === 'LAST_MESSAGES') {
          this.setState({messages: data.messages});
        } else if (data.type === 'SEND_COORDINATES') {

        }
      } catch (e) {
        console.log('Something went wrong', e);
      }
    };

  }

  sendMessage = e => {
    e.preventDefault();

    const message = {
      type: 'CREATE_MESSAGE',
      text: this.state.text
    };

    this.websocket.send(JSON.stringify(message));
  };

  setUsername = e => {
    e.preventDefault();

    const message = {
      type: 'SET_USERNAME',
      username: this.state.username
    };

    this.websocket.send(JSON.stringify(message));
  };
  onCanvasClick = e => {
    e.persist();

    const canvas = this.canvas.current;

    const ctx = canvas.getContext('2d');

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const coord = [x, y];

    ctx.fillStyle = 'aquamarine';
    ctx.fillRect(x -5, y - 5, 10, 10);
    console.log(JSON.stringify(coord));

    const coordinates = {
      type: 'SEND_COORDINATES',
      text: this.state.coordinates
    };

    this.websocket.send(JSON.stringify(coordinates));

  };

  canvas = createRef();

  changeField = e => this.setState({[e.target.name]: e.target.value});

  render() {
    return (
      <>
        <form onSubmit={this.setUsername}>
          <input type="text" value={this.state.username} name="username" onChange={this.changeField} />
          <button type="submit">Set username!</button>
        </form>
        <form onSubmit={this.sendMessage}>
          <input type="text" value={this.state.text} name="text" onChange={this.changeField} />
          <button type="submit">Send message!</button>
        </form>

        {this.state.messages.map((msg, i) => (
          <div key={i}>
            <strong>{msg.username}: </strong>{msg.text}
          </div>
        ))}

        <canvas width="1000" height="800" ref={this.canvas} onClick={this.onCanvasClick}/>
      </>
    );
  }
}

export default App;