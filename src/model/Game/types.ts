import { Player } from "../Player";
import { WebSocket } from "http";
// Interface for ship position
interface Position {
    x: number;
    y: number;
}

// Interface for a single ship
interface Ship {
    position: Position;
    direction: boolean;
    length: number;
    type: "small" | "medium" | "large" | "huge";
}


export interface Flot {
    gameId?: number | string;
    ships: Ship[];
    indexPlayer?: number | string;  // ID of the player in the current game session
}

