import { LoginRequest } from "./types";

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
        this.ws.send(JSON.stringify({ type, data, id: 0 }));
    }
    
    register(data:LoginRequest) {
        // TODO: MANAGE DB
        const players = this.players as Player[] 
        const { name, password } = data;
        const existingPlayer = players.find(p => p.name === name);

        if (existingPlayer && existingPlayer.password !== password) {
            this.ws.send(JSON.stringify({
                type: 'reg',
                data: { name, index: null, error: true, errorText: 'Incorrect password' },
                id: 0,
            }));
            return;
        }

        const player = existingPlayer || new Player(name, password, this.ws);
        if (!existingPlayer) players.push(player);

        this.ws.send(JSON.stringify({
            type: 'reg',
            data: { name: player.name, index: player.id, error: false },
            id: 0,
        }));
    }
}
