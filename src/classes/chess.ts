interface chess {
    board: Array<string[] | null[]>;
    turn: string;
}

class chess {
    // Private only accessed in this class
    private BOARDSIZE = 7;

    constructor() {
        // prettier-ignore
        // TODO: Assign objects with labels like WHITE or BLACK to mark team pieces, and etc
        // And give pawns a isFirstMove boolean to handle allowing 2 or 1 squares?
        this.board = [
            ["ROOK", "KNIGHT", "BISHOP", "QUEEN", "KING", "BISHOP", "KNIGHT", "ROOK"],
            ["PAWN", "PAWN", "PAWN", "PAWN", "PAWN", "PAWN", "PAWN", "PAWN"],
            ["ROOK", null, null, null, null, null, null, null],
            [null, null, null, "KNIGHT", "BISHOP", null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, "KNIGHT", null, null, null, null, null, null],
            ["PAWN", "PAWN", "PAWN", "PAWN", "PAWN", "PAWN", "PAWN", "PAWN"],
            ["ROOK", "KNIGHT", "BISHOP", "QUEEN", "KING", "BISHOP", "KNIGHT", "ROOK"]
        ];
        this.turn = "WHITE";
    }
    findValidMoves(pos: Array<number>) {
        return;
    }

    placeMove() {
        return;
    }

    getNeighbors(pos: Array<number>) {
        const PIECES = {
            KING: [
                [1, 1],
                [-1, -1],
                [1, 0],
                [0, 1],
                [-1, 0],
                [0, -1],
                [-1, 1],
                [1, -1],
            ],
            QUEEN: [
                [1, 1],
                [-1, -1],
                [1, 0],
                [0, 1],
                [-1, 0],
                [0, -1],
                [-1, 1],
                [1, -1],
            ],
            ROOK: [
                [0, 1],
                [1, 0],
                [0, -1],
                [-1, 0],
            ],
            BISHOP: [
                [1, 1],
                [-1, -1],
                [-1, 1],
                [1, -1],
            ],
            KNIGHT: [
                [2, 1],
                [2, -1],
                [-2, 1],
                [-2, -1],
                [1, 2],
                [-1, 2],
                [1, -2],
                [-1, -2],
            ],
            PAWN:
                this.turn === "WHITE"
                    ? [
                          [-1, 0],
                          [-2, 0],
                      ]
                    : [
                          [1, 0],
                          [2, 0],
                      ],
        };

        const infiniteSpaces = ["QUEEN", "ROOK", "BISHOP"];

        const pawnSides =
            this.turn === "WHITE"
                ? [
                      [-1, -1],
                      [-1, 1],
                  ]
                : [
                      [1, 1],
                      [1, -1],
                  ];

        const goesOffBoard = (pos: number[]) => {
            for (let i = 0; i < pos.length; i++) {
                if (pos[i] < 0 || pos[i] > this.BOARDSIZE) {
                    return true;
                }
            }
            return false;
        };

        const [startRow, startCol] = pos;
        const piece = this.board[startRow][startCol];
        const pieceMoves = PIECES[piece];
        const neighbors: Array<number[]> = [];

        outerLoop: for (const move of pieceMoves) {
            const [rowMove, colMove] = move;
            const neighbor = [startRow + rowMove, startCol + colMove];
            const [neighborRow, neighborCol] = neighbor;

            if (piece === "PAWN") {
                // CHECK IF SIDES HAVE ENEMY PIECES
                for (const side of pawnSides) {
                    const [rowMove, colMove] = side;
                    const neighbor = [startRow + rowMove, startCol + colMove];
                    const [neighborRow, neighborCol] = neighbor;

                    if (this.board[neighborRow][neighborCol] !== null) {
                        neighbors.push(neighbor);
                    }
                }
            }
            // First check if it goes off the board
            if (goesOffBoard(neighbor)) {
                continue outerLoop;
            }

            if (this.board[neighborRow][neighborCol] !== null) {
                continue;
            }

            if (infiniteSpaces.includes(piece)) {
                // Keep checking neighbor of that neighbor with a for loop or while loop, until you hit off the board or a spot is taken
                let neighborOfNeighbor = [neighborRow, neighborCol];
                while (true) {
                    const [row, col] = neighborOfNeighbor;
                    neighborOfNeighbor = [row + rowMove, col + colMove];
                    const [nonRow, nonCol] = neighborOfNeighbor;

                    if (
                        !goesOffBoard([nonRow, nonCol]) &&
                        this.board[nonRow][nonCol] === null
                    ) {
                        neighbors.push(neighborOfNeighbor);
                    } else {
                        break;
                    }
                }
            }

            neighbors.push(neighbor);
        }

        return neighbors;
    }
}

export default chess;
