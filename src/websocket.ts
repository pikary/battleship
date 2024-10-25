import { WebSocketServer } from 'ws'
import { Player, PlayerFactory } from './model/Player';
import { Room } from './model/Room';
import { SocketRequest, RequestTypes } from './types';
import { LoginRequest } from './model/Player/types';
import database from './db';
const wss = new WebSocketServer({ port: 8080 });

const players: Player[] = [];
const rooms: Room[] = [];
// const games: Game[] = [];

wss.on('connection', (ws) => {
    ws.on('message', (message: SocketRequest) => {
        switch (message.type) {
            case RequestTypes.REGISTER:
                const reqbody = (message.data) as LoginRequest
                PlayerFactory.createPlayer(reqbody.name, reqbody.password, ws, database)
                break
        }
    });

    ws.on('close', () => {
        console.log('Player disconnected');
    });
});