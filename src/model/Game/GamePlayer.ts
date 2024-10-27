import { Flot, Ship } from "./types";
import { Player } from "../Player";
import { WebSocket } from "ws";
import { ResponseTypes } from "../../types";
import { log } from "node:console";


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
            log(ship)
        }

        for (const ship of this.enemy.flot.ships) {

            // {X:4, y:3, length:3,direction:false} ---> Начало - x4 --- конец - x7
            const startX = ship.position.x
            const startY = ship.position.y
            //вертикальный
            const endX = ship.direction === false ? startX + ship.length - 1 : startX
            const endY = ship.direction === true ? startY + ship.length - 1 : startY

            if (startX <= x && endX >= x && startY <= y && endY >= y) {
                ship.position.isHit = true;  // Mark the position as hit
                const responseAttacker = {
                    type: ResponseTypes.ATTACK,
                    data: JSON.stringify({
                        position: {
                            x: x,
                            y: y
                        },
                        currentPlayer: this.id,
                        status: 'shot'
                    })
                }

                const responseDefender = {
                    type: ResponseTypes.ATTACK,
                    data: JSON.stringify({
                        position: {
                            x: x,
                            y: y
                        },
                        currentPlayer: this.enemy.id,
                        status: 'shot'
                    })
                }
                this.ws.send(JSON.stringify(responseAttacker))
                this.enemy.ws.send(JSON.stringify(responseDefender))
                return true;
            }
        }
        return false;  // The attack missed
    }
}
