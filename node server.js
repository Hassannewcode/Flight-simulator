// server.js
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

const rooms = {}; // { roomId: { clients: Set<WebSocket> } }

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    try {
      const data = JSON.parse(message);

      if (data.type === 'join') {
        ws.roomId = data.room;
        if (!rooms[ws.roomId]) rooms[ws.roomId] = { clients: new Set() };
        rooms[ws.roomId].clients.add(ws);
        ws.send(JSON.stringify({ type: 'welcome', id: ws._socket.remotePort.toString() }));
        broadcastPlayerList(ws.roomId);
      }

      if (data.type === 'position' && ws.roomId) {
        // Broadcast to all clients in the same room except sender
        rooms[ws.roomId].clients.forEach(client => {
          if(client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
          }
        });
      }

    } catch (e) { console.error(e); }
  });

  ws.on('close', () => {
    if(ws.roomId && rooms[ws.roomId]) {
      rooms[ws.roomId].clients.delete(ws);
      if(rooms[ws.roomId].clients.size === 0) delete rooms[ws.roomId];
      else broadcastPlayerList(ws.roomId);
    }
  });

  function broadcastPlayerList(roomId) {
    const clients = rooms[roomId].clients;
    const playerIds = Array.from(clients).map(c => c._socket.remotePort.toString());
    clients.forEach(client => {
      if(client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'playerlist', players: playerIds }));
      }
    });
  }
});
