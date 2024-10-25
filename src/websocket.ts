import { WebSocketServer } from 'ws'
import { Player, PlayerFactory } from './model/Player';
import { Room } from './model/Room';
import { SocketRequest, RequestTypes } from './types';
import { LoginRequest } from './model/Player/types';
import database from './db';
import { log } from 'console';

const wss = new WebSocketServer({
    port: 3000, perMessageDeflate: false
});

const players: Player[] = [];
const rooms: Room[] = [];
// const games: Game[] = [];

wss.on('connection', (ws) => {
    ws.on('open', () => {
        console.log("lingaguliguli")
    })
    ws.on('message', (message: SocketRequest) => {
        // ws.send(JSON.stringify({msg:'niggers'}))
        const parsed = JSON.parse(message.toString())
        console.log();
        switch ( parsed.type) {
            case RequestTypes.REGISTER:
                console.log(parsed);
                const reqbody = JSON.parse((parsed.data)) as LoginRequest
                const newPlayer = PlayerFactory.createPlayer(reqbody.name, reqbody.password, ws, database)
                break
        }
    });

    ws.on('close', () => {
        console.log('Player disconnected');
    });
});
