import { Player } from './Player';

export class Room {
    static roomCounter = 1;
    id: number;
    players: Player[];

    constructor(player: Player) {
        this.id = Room.roomCounter++;
        this.players = [player];
    }

    addPlayer(player: Player) {
        this.players.push(player);
    }

    isReady() {
        return this.players.length === 2;
    }

    notifyPlayers(type: string, data: any) {
        this.players.forEach(player => player.sendMessage(type, data));
    }
}
