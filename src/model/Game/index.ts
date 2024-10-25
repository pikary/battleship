import { Room } from "../Room";
import { Player } from "../Player";
import { WebSocket } from "ws";
import { IDatabase } from "../../db";
import { ResponseTypes } from "../../types";

export class GameFactory {
    public static createGame(room: Room, ws: WebSocket, db: IDatabase,) {
        const newGame = new Game(room)
        newGame.players.forEach((pl,ind) => {
            const response = {
                type: ResponseTypes.CREATE_GAME,
                data: JSON.stringify({
                    idGame: newGame.id,
                    idPlayer: ++ind
                })
            }
            pl.ws.send(JSON.stringify({
                type: ResponseTypes.UPDATE_ROOM,
                data: JSON.stringify(db.rooms),
                id: 0,
            }));
            pl.ws.send(JSON.stringify(response))
        })    
        return newGame
    }
}

export class Game {
    static gameCounter = 1;
    id: number;
    players: Player[];

    constructor(room: Room) {
        this.id = Game.gameCounter++;
        this.players = room.roomUsers;
        // Initialize game board and ships here
    }

    startGame() {
        this.notifyPlayers('start_game', {
            ships: [],  // Player's ships (not the enemy's)
            currentPlayerIndex: this.players[0].id,
        });
    }

    notifyPlayers(type: string, data: any) {
        this.players.forEach(player => player.sendMessage(type, data));
    }
}
