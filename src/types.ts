export enum RequestTypes{
    REGISTER='reg',
    CREATE_ROOM='create_room',
    ADD_USER='add_user_to_room',
    ADD_SHIPS='add_ships',
    ATTACK='attack',
    RANDOM_ATTACK='randomAttack',   
}
export enum ResponseTypes{
    REGISTER='reg',
    UPDATE_WINNERS='update_winners',
    CREATE_GAME='create_game',
    UPDATE_ROOM='update_room',
    START_GAME='start_room',
    ATTACK='attack',
    TURN='turn',
    FINISH='finish',
}

export interface SocketRequest<T>{
    type:RequestTypes,
    data:T,
    id:number
}



