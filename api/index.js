const express = require('express');
const cors = require('cors');
const expressWs = require('express-ws');
const {nanoid} = require('nanoid');

const app = express();
const port = 8000;

expressWs(app);

app.use(express.json());
app.use(cors());

const squares = [];

const connections = {};

app.ws('/square', (ws, req) => {
  const id = nanoid();
  console.log('client connected id=', id);
  connections[id] = ws;


  ws.send(JSON.stringify({
    type: 'ALL_CIRCLES',
    squares: squares
  }));

  ws.on('message', msg => {
    let createSquare;

    try{
      createSquare = JSON.parse(msg);
    } catch(e) {
      return console.log('Not a valid message')
    }

    if (createSquare.type === 'CREATE_SQUARE') {
      Object.keys(connections).forEach(connId => {
        const conn = connections[connId];

        const newSquares = {squares: createSquare.squares};

        conn.send(JSON.stringify({
          type: 'NEW_SQUARE',
          ...newSquares
        }));

        squares.push(newSquares)

      });
    } else {
      console.log('Not valid message type, ', createSquare.type);
    }
  });

  ws.on('close', msg => {
    console.log('client disconnected id=', id);
    delete connections[id];
  });
});

app.listen(port, () => {
  console.log(`Server started on ${port} port!`);
});

