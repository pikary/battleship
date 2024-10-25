import { Player } from "../model/Player"
import { Room } from "../model/Room"

interface IDatabase{
    players:Player[],
    rooms: Room[]
}

const database:IDatabase = {
    players: [],
    rooms:[]
}

export default database