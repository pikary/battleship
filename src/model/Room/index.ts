import { WebSocket } from 'ws';
import { Player } from '../Player';
import database, { IDatabase } from '../../db';
import { ResponseTypes } from '../../types';


export class RoomFactory{
    public static createRoom(initialPlayer:Player,ws:WebSocket,db:IDatabase){
        const newRoom = new Room(initialPlayer)
        db.rooms.push(newRoom)
        // update rooms in frontend
        const response = {
            type:ResponseTypes.UPDATE_ROOM,
            data: JSON.stringify(db.rooms),
            id:0
        }
        ws.send(JSON.stringify(response))
        return newRoom
    }
}
export class Room {
    static roomCounter = 1;
    id: number;
    roomUsers: Player[];

    constructor(player: Player) {
        this.id = Room.roomCounter++;
        this.roomUsers = [player];
    }

    addPlayer(player: Player) {
        this.roomUsers.push(player);
    }

    isReady() {
        return this.roomUsers.length === 2;
    }

    notifyroomUsers(type: string, data: any) {
        this.roomUsers.forEach(player => player.sendMessage(type, data));
    }
}
