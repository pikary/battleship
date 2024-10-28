import { Flot, Ship } from "./types";
import { Player } from "../Player";
import { WebSocket } from "ws";
import { ResponseTypes } from "../../types";
import { log } from "node:console";
import database from "../../db";

export class GamePlayerFactory {
    public static createPlayersForGame(players: Player[]) {
        //принцип создания айди для игрока --- индекс новой игры + айди человека
        const newArr = players.map((pl) =>
            new GamePlayer(pl.id, pl.name, pl.ws)
        )
        return newArr
    }
}

export class GamePlayer extends Player {
    flot: Flot
    enemy: GamePlayer


    constructor(id: number, name: string, ws: WebSocket) {
        super(name, '', ws, id);
        this.flot = { ships: [] };
    }

    addShips(ships: Ship[]) {
        this.flot.ships = ships
    }
    setEnemy(enemy: GamePlayer) {
        this.enemy = enemy
    }




    attack(x: number, y: number): boolean {

        for (const ship of this.enemy.flot.ships) {
            if (ship.shotPositions == undefined) {
                ship.shotPositions = []
            }
            // {X:4, y:3, length:3,direction:false} ---> Начало - x4 --- конец - x7
            const startX = ship.position.x
            const startY = ship.position.y
            //вертикальный
            const endX = ship.direction === false ? startX + ship.length - 1 : startX
            const endY = ship.direction === true ? startY + ship.length - 1 : startY

            if (startX <= x && endX >= x && startY <= y && endY >= y) {

                ship.shotPositions.push({ x: x, y: y })
                const isShipKilled = ship.shotPositions.length === ship.length;

                const status = isShipKilled ? 'kill' : 'shot';


                this.sendAttackResponse(x, y, status);

                return true;
            }
        }
        this.sendAttackResponse(x, y, 'miss');
        // this.switchTurn(status)

        return false;  // The attack missed
    }




    sendAttackResponse(x: number, y: number, status: 'shot' | 'kill' | 'miss') {
        const responseAttacker = {
            type: ResponseTypes.ATTACK,
            data: JSON.stringify({
                position: { x: x, y: y },
                currentPlayer: this.id,
                status: status

            },),
            status: status

        };

        const responseDefender = {
            type: ResponseTypes.ATTACK,
            data: JSON.stringify({
                position: { x: x, y: y },
                currentPlayer: this.enemy.id,
                status: status

            }),

        };

        // Send response to both attacker and defender
        this.ws.send(JSON.stringify(responseAttacker));
        this.enemy.ws.send(JSON.stringify(responseDefender));
        this.sendTurnResponse(status)
        if (status === 'kill' || status === 'shot') {
            const hadWon = this.checkIfPlayerWon()
            if (hadWon) {
                this.sendFinishResponse()
            }
        }
    }

    sendTurnResponse(status: 'shot' | 'kill' | 'miss') {
        const turnResponse = {
            type: ResponseTypes.TURN,
            data: JSON.stringify({
                currentPlayer: status === 'shot' || status === 'kill' ? this.id : this.enemy.id  //если попал дай возможность еще раз ходить
            }),
            id: 0,
        };
        this.ws.send(JSON.stringify(turnResponse));
        this.enemy.ws.send(JSON.stringify(turnResponse));
    }

    sendFinishResponse() {
        const finishResponse = {
            type: ResponseTypes.FINISH,
            data: JSON.stringify({
                winPlayer: this.id
            }),
            id: 0
        }
        this.incWins()
        this.ws.send(JSON.stringify(finishResponse));
        this.enemy.ws.send(JSON.stringify(finishResponse));
        const players = database.players
        this.ws.send(JSON.stringify({
            type: ResponseTypes.UPDATE_WINNERS,
            data: JSON.stringify(players.map((i) => ({ ...i, wins: this.wins }))),
            id: 0
        }));
        this.enemy.ws.send(JSON.stringify({
            type: ResponseTypes.UPDATE_WINNERS,
            data: JSON.stringify(players.map((i) => ({ ...i }))),
            id: 0
        }));
    }


    checkIfPlayerWon(): boolean {
        return this.enemy.flot.ships.every(ship => ship.shotPositions && ship.shotPositions.length >= ship.length);
    }
}
