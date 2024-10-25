import { LoginRequest } from "./types";
import { IDatabase } from "../../db";
import { WebSocket } from "ws";
import { error } from "console";

export class PlayerFactory {
    static createPlayer(name: string, password: string, ws: WebSocket, db: IDatabase): Player | null {
        // Check if the player already exists in the database
        const existingPlayer = db.players.find((pl) => pl.name === name);

        if (existingPlayer) {
            if (existingPlayer.password !== password) {
                ws.send(JSON.stringify({
                    type: 'reg',
                    data: { name, index: null, error: true, errorText: 'Incorrect password' },
                    id: 0,
                }));
                return null;
            }

            // Return the existing player if the password is correct
            existingPlayer.sendMessage('reg', {
                name: existingPlayer.name,
                index: existingPlayer.id,
                error: false,
            });
            return existingPlayer;
        }

        // If the player doesn't exist, create a new one
        const newPlayer = new Player(name, password, ws);
        db.players.push(newPlayer); // Add the new player to the database

        // Send a successful registration message to the new player
      
        newPlayer.sendMessage('reg',{
            name:newPlayer.name,
            index:newPlayer.id,
            error:false
        })
        return newPlayer;
    }
}

export class Player {
    static idCounter = 1;
    id: number;
    name: string;
    password: string;
    ws: WebSocket;

    constructor(name: string, password: string, ws: WebSocket) {
        this.id = Player.idCounter++;
        this.name = name;
        this.password = password;
        this.ws = ws;
    }

    sendMessage(type: string, data: any) {
        this.ws.send(JSON.stringify({ type, data:JSON.stringify(data), id: 0 }));
    }

}
