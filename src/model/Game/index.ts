    import { Room } from "../Room";
    import { Player } from "../Player";
    import { WebSocket } from "ws";
    import { IDatabase } from "../../db";
    import { ResponseTypes } from "../../types";
    import { Flot } from "./types";
    import { GamePlayer, GamePlayerFactory } from "./GamePlayer";


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
        players: GamePlayer[];
        flot: Flot
        currentTurnPlayer:GamePlayer

        constructor(room: Room) {
            this.id = Game.gameCounter++;
            this.players = GamePlayerFactory.createPlayersForGame(room.roomUsers);
            // Initialize game board and ships here
        }

        setTurn(player:GamePlayer){
            this.currentTurnPlayer = player
        }

        rotateTurn(player:GamePlayer){
            this.currentTurnPlayer = player
        }

        checkTurn(player:GamePlayer){
            return player == this.currentTurnPlayer
        }
        setConfrontation(){
            this.players[0].setEnemy(this.players[1])
            this.players[1].setEnemy(this.players[0])
        }
        arePlayersReady(): boolean {
            return this.players.every(player => player.flot.ships.length > 0);
        }
    
    }
