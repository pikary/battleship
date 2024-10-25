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
}
