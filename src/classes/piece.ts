interface piece {
    team: string;
    piece: string;
    index: number[];
}

class piece {
    constructor(team: string, piece: string, index: number[]) {
        this.team = team;
        this.piece = piece;
        this.index = index;
    }
}

export default piece;
