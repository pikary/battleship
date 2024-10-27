import { WebSocketServer } from 'ws';
import { Player, PlayerFactory } from './model/Player';
import { Room, RoomFactory } from './model/Room';
import { SocketRequest, RequestTypes, ResponseTypes } from './types';
import { LoginRequest } from './model/Player/types';
import database from './db';
import { log } from 'console';
import { GameFactory } from './model/Game';
import { Flot, Ship } from './model/Game/types';

const wss = new WebSocketServer({
    port: 3000, perMessageDeflate: false
});

const players: Player[] = [];
const rooms: Room[] = [];

wss.on('connection', (ws) => {
    ws.on('open', () => {
        console.log("lingaguliguli");
    });

    ws.on('message', (message: SocketRequest) => {
        const parsed = JSON.parse(message.toString());

        switch (parsed.type) {
            case RequestTypes.REGISTER: {
                const reqbody = JSON.parse(parsed.data) as LoginRequest;
                const newPlayer = PlayerFactory.createPlayer(reqbody.name, reqbody.password, ws, database);

                if (newPlayer) {
                    // Broadcast updated room and player wins to all players
                    database.players.forEach((user) => {
                        user.ws.send(JSON.stringify({
                            type: ResponseTypes.UPDATE_ROOM,
                            data: JSON.stringify(database.rooms),
                            id: 0
                        }));

                        user.ws.send(JSON.stringify({
                            type: ResponseTypes.UPDATE_WINNERS,
                            data: JSON.stringify(database.players.map((i) => ({ ...i, wins: 1 }))),
                            id: 0
                        }));
                    });
                }
                break;
            }

            case RequestTypes.CREATE_ROOM: {
                const currentPlayer = database.players.find((p) => p.ws === ws);

                if (currentPlayer) {
                    const newRoom = RoomFactory.createRoom(currentPlayer, ws, database);
                    const response = {
                        type: ResponseTypes.UPDATE_ROOM,
                        data: JSON.stringify(database.rooms),
                        id: 0
                    };
                    // Broadcast updated room list to all players
                    database.players.forEach((user) => {
                        user.ws.send(JSON.stringify(response));
                    });
                }
                break;
            }

            case RequestTypes.ADD_USER: {
                const currentPlayer = database.players.find((p) => p.ws === ws);
                const reqbody = JSON.parse(parsed.data);
                const room = database.rooms.find((r) => r.roomId === reqbody.indexRoom);

                if (currentPlayer && room) {
                    room.addPlayer(currentPlayer);
                    const newGame = GameFactory.createGame(room, ws, database);
                    database.games.push(newGame);

                    // Notify all players in the new game
                    newGame.players.forEach((p) => {
                        const response = {
                            type: ResponseTypes.UPDATE_ROOM,
                            data: JSON.stringify(database.rooms),
                            id: 0
                        };
                        p.ws.send(JSON.stringify(response));
                    });
                }
                break;
            }

            case RequestTypes.ADD_SHIPS: {
                console.log('THIS IS ADD_SHIP CALL');
                const reqbody = JSON.parse(parsed.data);
                const ships = reqbody.ships as Ship[];
                const gameId = reqbody.gameId;
                const indexPlayer = reqbody.indexPlayer;

                const currentGame = database.games.find(game => game.id === gameId);
                if (currentGame) {
                    const targetPlayer = currentGame.players.find((pl) => pl.id === indexPlayer);
                    if (targetPlayer) {
                        targetPlayer.addShips(ships);

                        // If both players are ready, start the game
                        if (currentGame.arePlayersReady()) {
                            currentGame.setConfrontation()
                            currentGame.players.forEach((pl) => {
                                const startGameResponse = {
                                    type: ResponseTypes.START_GAME,
                                    data: JSON.stringify({
                                        ships: pl.flot.ships,
                                        currentPlayerIndex: pl.id
                                    })
                                };

                                pl.ws.send(JSON.stringify(startGameResponse));
                                const turnResponse = {
                                    type: ResponseTypes.TURN,
                                    data: JSON.stringify({
                                        currentPlayer: currentGame.players[0].id
                                    })
                                }
                                currentGame.setTurn(currentGame.players[0])
                                    pl.ws.send(JSON.stringify(turnResponse))
                            });

                        }
                    }
                }
                break;
            }

            case RequestTypes.ATTACK: {
                // Handle attack logic here
                const reqbody = JSON.parse(parsed.data )
                //TODO: следить за тем кто ходит в свою очередь
                const {x,y, gameId,indexPlayer} = reqbody
                const currentGame = database.games.find((g)=>g.id === gameId)
                const targetPlayer = currentGame.players.find((p)=>p.id == indexPlayer)
                if(currentGame.checkTurn(targetPlayer)){
                    targetPlayer.attack(x,y)
                    currentGame.rotateTurn(targetPlayer.enemy)
                }
                console.log('NUH UH WAIT');
                
                

                break;
            }


            default:
                console.log('Unknown request type:', parsed.type);
                break;
        }
    });

    ws.on('close', () => {
        console.log('Player disconnected');
    });
});
