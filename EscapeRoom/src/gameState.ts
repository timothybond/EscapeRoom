export interface GameState {
    keyCount: number;
    mazeX: number,
    mazeY: number,
    kaleidoscopeGear1: number;
    kaleidoscopeGear2: number;
    kaleidoscopeGear3: number;
    bookPage: number;
    clue1Seen: boolean;
    clue2Seen: boolean;
    clue3Seen: boolean;
    clue4Seen: boolean;
    solved3Board: boolean;
    solved4Board: boolean;
    finished: boolean;
    use4Board: boolean;
    loaded: boolean;
    runesValid: boolean;
    activeRunes: Array<Array<boolean>>;
    runeCharges: Array<Array<number>>;
}

export interface GameStateUpdate {
    keyCount?: number;
    mazeX?: number,
    mazeY?: number,
    kaleidoscopeGear1?: number;
    kaleidoscopeGear2?: number;
    kaleidoscopeGear3?: number;
    bookPage?: number;
    clue1Seen?: boolean;
    clue2Seen?: boolean;
    clue3Seen?: boolean;
    clue4Seen?: boolean;
    solved3Board?: boolean;
    solved4Board?: boolean;
    finished?: boolean;
    use4Board?: boolean;
    loaded?: boolean;
    runesValid?: boolean;
    activeRunes?: Array<Array<boolean>>;
    runeCharges?: Array<Array<number>>;
}