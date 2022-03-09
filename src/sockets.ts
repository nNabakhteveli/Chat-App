import http from 'http';
import { server as WebSocketServer } from 'websocket';
import express, { Application, Request, Response } from 'express';
import { nanoid } from 'nanoid';

const webSocketsServerPort = 8000;
const app: Application = express();

const server = http.createServer(app);

server.listen(webSocketsServerPort, () => console.log(`listening on ${webSocketsServerPort}`));

const wsServer = new WebSocketServer({
   httpServer: server
});

const clients: any = {};

wsServer.on('request', (request) => {
   const userID = nanoid();

   console.log((new Date()) + ' - Received a new connection from origin: ' + request.origin)

   const connection = request.accept(null, request.origin);
   clients[userID] = connection;

   console.log("Connected " + userID + ' in ' + Object.getOwnPropertyNames(clients));

   connection.on('message', (message) => {
      if (message.type === 'utf8') {
         console.log("message: ", message.utf8Data);
         

         for (const key in clients) {
            clients[key].sendUTF(message.utf8Data);
         }
      } 
   })
})