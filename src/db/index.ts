import { Game } from "../model/Game"
import { Player } from "../model/Player"
import { Room } from "../model/Room"

export interface IDatabase{
    players:Player[],
    rooms: Room[],
    games:Game[]
}

const database:IDatabase = {
    players: [],
    rooms:[],
    games:[]
}

export default database