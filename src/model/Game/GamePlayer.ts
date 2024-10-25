import { Flot } from "./types";
import { Player } from "../Player";
import { WebSocket } from "ws";

export class GamePlayer extends Player{
    flot:Flot
    constructor(name: string, password: string, ws: WebSocket) {

        super(name, password, ws);
        this.flot = { ships: [] };  
    }

}