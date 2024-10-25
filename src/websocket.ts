import { WebSocketServer } from 'ws'
import { Player, PlayerFactory } from './model/Player';
import { Room, RoomFactory } from './model/Room';
import { SocketRequest, RequestTypes, ResponseTypes } from './types';
import { LoginRequest } from './model/Player/types';
import database from './db';
import { log } from 'console';
import { GameFactory } from './model/Game';

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
        console.log(message);
        
        const parsed = JSON.parse(message.toString())
    
        switch (parsed.type) {
            case RequestTypes.REGISTER:
                const reqbody = JSON.parse((parsed.data)) as LoginRequest
                PlayerFactory.createPlayer(reqbody.name, reqbody.password, ws, database)
                database.players.forEach((user) => {
                    user.ws.send(JSON.stringify({
                        type: ResponseTypes.UPDATE_ROOM,
                        data: JSON.stringify(database.rooms),
                        id: 0,
                    }))
                })

                database.players.forEach((user) => {
                    user.ws.send(JSON.stringify({
                        type: ResponseTypes.UPDATE_WINNERS,
                        data: JSON.stringify((database.players.map((i) => ({ ...i, wins: 1 })))),
                        id: 0,
                    }));
                })
       


                break

            case RequestTypes.CREATE_ROOM:
                // need  to get a user who creaing room.  current user
                const currentPlayer = database.players.find((p) => p.ws === ws)
                const newRoom = RoomFactory.createRoom(currentPlayer, ws, database)
                const response = {
                    type: ResponseTypes.UPDATE_ROOM,
                    data: JSON.stringify(database.rooms),
                    id: 0
                }
                database.players.forEach((user)=>{
                    user.ws.send(JSON.stringify(response))
                })
                break;

            case RequestTypes.ADD_USER:
                const currentPlayer2 = database.players.find((p) => p.ws === ws)
                log(parsed)
                const reqbody2 = JSON.parse(parsed.data).indexRoom
                const room = database.rooms.find((r) => r.roomId === reqbody2)
                room.addPlayer(currentPlayer2)
                const newGame = GameFactory.createGame(room, ws, database)
                newGame.players.forEach((p)=>{
                    const response = {
                        type: ResponseTypes.UPDATE_ROOM,
                        data: JSON.stringify(database.rooms),
                        id: 0
                    }
                    p.ws.send(JSON.stringify(response))
                })

        }
    });

    ws.on('close', () => {
        console.log('Player disconnected');
    });
});
