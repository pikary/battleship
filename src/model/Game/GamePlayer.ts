import { Flot,Ship } from "./types";
import { Player } from "../Player";
import { WebSocket } from "ws";


export class GamePlayerFactory{
    public static createPlayersForGame(players:Player[]){
        //принцип создания айди для игрока --- индекс новой игры + айди человека
        const newArr = players.map((pl)=>
            new GamePlayer(pl.id,pl.name,pl.ws)
        )
        return newArr
    }
}

export class GamePlayer extends Player{
    flot:Flot
    constructor(id:number,name: string, ws: WebSocket) {
        super(name, '', ws);
        this.flot = { ships: [] };  
    }
    

    addShips(ships:Ship[]){
        this.flot.ships = ships
    }
}
