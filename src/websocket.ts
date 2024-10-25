import { WebSocketServer } from 'ws'
import { Player, PlayerFactory } from './model/Player';
import { Room, RoomFactory } from './model/Room';
import { SocketRequest, RequestTypes, ResponseTypes } from './types';
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
        switch (parsed.type) {
            case RequestTypes.REGISTER:
                console.log(parsed);
                const reqbody = JSON.parse((parsed.data)) as LoginRequest
                PlayerFactory.createPlayer(reqbody.name, reqbody.password, ws, database)
                ws.send(JSON.stringify({
                    type: ResponseTypes.UPDATE_ROOM,
                    data: JSON.stringify([
                        {
                            roomId: 1,
                            roomUsers: [
                                {
                                    name: '1 room',
                                    index: 0,
                                },
                            ],
                        },
                    ]),
                    id: 0,
                }));

                ws.send(JSON.stringify({
                    type: ResponseTypes.UPDATE_WINNERS,
                    data: JSON.stringify([
                        {
                            name: 'nurlan',
                            wins: 1,
                        },
                    ]),
                    id: 0,
                }));
                console.log('Players : ');
                console.log(database.players);

                
                break

            case RequestTypes.CREATE_ROOM:
                // need  to get a user who creaing room.  current user
                const currentPlayer = database.players.find((p)=>p.ws === ws)
                const newRoom = RoomFactory.createRoom(currentPlayer,ws,database)
                console.log('Rooms : ');
                console.log(database.rooms);
                break;

        }
    });

    ws.on('close', () => {
        console.log('Player disconnected');
    });
});
