import React, {Component, createRef} from 'react';
import './App.css';

class App extends Component {
	state = {
		squares: []
	};

	componentDidMount() {
		this.websocket = new WebSocket('ws://localhost:8000/square');

		this.websocket.onmessage = event => {
			try {
				const data = JSON.parse(event.data);
				if (data.type === 'NEW_SQUARE') {
					this.setState({
						squares: [
							...this.state.squares,
							data.squares
						]
					})
				} else if (data.type === 'ALL_CIRCLES') {
					this.setState({squares: data.squares});
				}
			} catch (e) {
				console.log('Something went wrong', e);
			}

		}
	}

	canvas = createRef();

	drawSquare = e => {
		e.persist();

		const x = e.nativeEvent.offsetX;
		const y = e.nativeEvent.offsetY;

		this.websocket.send(JSON.stringify({
			type: 'CREATE_SQUARE',
			squares: {
				x: x,
				y: y
			}
		}));
	};

	render () {
		this.state.squares.forEach(square => {
			const ctx = this.canvas.current.getContext('2d');
			ctx.beginPath();
			const pi = Math.PI;
			ctx.fill();
			ctx.strokeStyle = "green";
			ctx.fillStyle = "pink";
			ctx.arc(square.x,square.y,10,0, 2*pi );
			ctx.stroke();
		});

		return (
			<div style={{padding: '50px'}}>
				<canvas ref={this.canvas} width="1200px" height="500px" style={{border: '1px solid black'}} onClick={this.drawSquare}/>
			</div>
		);
	}
}

export default App;