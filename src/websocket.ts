import {WebSocketServer} from 'ws'
import { Player } from './model/Player';
import { Room } from './model/Room';
import { SocketRequest } from './types';
const wss = new WebSocketServer({ port: 8080 });

const players: Player[] = [];
const rooms: Room[] = [];
const games: Game[] = [];

// wss.on('connection', (ws) => {
//     ws.on('message', (message:SocketRequest<> ) => {
        
//     });



//     ws.on('close', () => {
//         console.log('Player disconnected');
//     });
// });



function registerPlayer(data: any, ws: WebSocket) {
    const { name, password } = data;
    const existingPlayer = players.find((p) => p.name === name);
    

    if (existingPlayer && existingPlayer.password !== password) {
        ws.send(
            JSON.stringify({
                type: 'reg',
                data: { name, index: null, error: true, errorText: 'Incorrect password' },
                id: 0,
            })
        );
        return;
    }

    // If player doesn't exist, create a new one
    const player = existingPlayer || new Player(name, password, ws);
    if (!existingPlayer) players.push(player);

    ws.send(
        JSON.stringify({
            type: 'reg',
            data: { name: player.name, index: player.id, error: false },
            id: 0,
        })
    );
}