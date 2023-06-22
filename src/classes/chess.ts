import piece from "./piece";

interface chess {
    board: Array<object>;
    turn: string;
}

class chess {
    // Private only accessed in this class
    private BOARDSIZE = 8;

    constructor() {
        // prettier-ignore
        // TODO: Assign objects with labels like WHITE or BLACK to mark team pieces, and etc
        // And give pawns a isFirstMove boolean to handle allowing 2 or 1 squares?
        this.board = this.generateBoard();
        this.turn = "WHITE";
    }

    generateBoard() {
        // 1D array, first 2 rows BLACK, last 2 rows WHITE
        // prettier-ignore
        const startBoard = [
            ["ROOK", "KNIGHT", "BISHOP", "QUEEN", "KING", "BISHOP", "KNIGHT", "ROOK",],
            ["PAWN", "PAWN", "PAWN", "PAWN", "PAWN", "PAWN", "PAWN", "PAWN",],
            [null, null, null, null, null, null, null, null,],
            [null, null, null, null, null, null, null, null,],
            [null, null, null, null, null, null, null, null,],
            [null, null, null, null, null, null, null, null,],
            ["PAWN", "PAWN", "PAWN", "PAWN", "PAWN", "PAWN", "PAWN", "PAWN",],
            ["ROOK", "KNIGHT", "BISHOP", "QUEEN", "KING", "BISHOP", "KNIGHT", "ROOK",],
        ]
        // TODO: if pawn add a firstMove boolean, and if for example its BLACK then if it's on the otherside of board give
        // option to change itself
        const arr = [];
        for (let i = 0; i < startBoard.length; i++) {
            arr.push([]);
            for (let j = 0; j < startBoard[0].length; j++) {
                if (i <= 1) {
                    arr[i].push(new piece("BLACK", startBoard[i][j], [i, j]));
                } else if (i >= 6) {
                    arr[i].push(new piece("WHITE", startBoard[i][j], [i, j]));
                } else {
                    arr[i].push(new piece("", startBoard[i][j] || "", [i, j]));
                }
            }
        }

        // TEMPORARY
        // arr[4][1].team = "WHITE";

        return arr;
    }
    findValidMoves(pos: Array<number>) {
        // This will return all the valid moves for a turn, so if white, return an array with
        // 2 Values, starting position, move position.
        // Might even be able to replace getNeighbors with this one
        // Or just modify getNeighbors to return what this function will do
        // And when rendering the moves just render the 2nd index (move position)
        return;
    }

    placeMove() {
        return;
    }

    // Could make this function just return all possible moves for the current turn player
    // Return an array with the starting pos and moving pos
    // And for the selectedPiece just find that index and get it from the all possible moves
    // LOOP through every index on the board, and if the piece team matches the current turn (do thing)
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
                          //   [-2, 0],
                      ]
                    : [
                          [1, 0],
                          //   [2, 0],
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
                if (pos[i] < 0 || pos[i] > this.BOARDSIZE - 1) {
                    return true;
                }
            }
            return false;
        };

        const [startRow, startCol] = pos;
        const objectPiece = this.board[startRow][startCol];
        const pieceMoves = PIECES[objectPiece.piece];
        const neighbors: Array<number[]> = [];

        outerLoop: for (const move of pieceMoves) {
            const [rowMove, colMove] = move;
            const neighbor = [startRow + rowMove, startCol + colMove];
            const [neighborRow, neighborCol] = neighbor;

            // And is not pawns first move?
            if (objectPiece.piece === "PAWN") {
                // CHECK IF SIDES HAVE ENEMY PIECES
                for (const side of pawnSides) {
                    const [rowMove, colMove] = side;
                    const neighbor = [startRow + rowMove, startCol + colMove];
                    const [neighborRow, neighborCol] = neighbor;

                    if (goesOffBoard(neighbor)) {
                        continue;
                    }

                    if (
                        this.board[neighborRow][neighborCol].team !==
                            this.turn &&
                        this.board[neighborRow][neighborCol].piece !== ""
                    ) {
                        neighbors.push(neighbor);
                    }
                }
            }
            // Clean this up or move it somewhere else
            if (objectPiece.piece === "PAWN") {
                // if neighbor above or below is blocking path don't do thing
                if (
                    this.board[neighborRow][neighborCol].team !== "" &&
                    this.board[neighborRow][neighborCol].team !== this.turn
                ) {
                    continue;
                }
            }
            // First check if it goes off the board
            if (goesOffBoard(neighbor)) {
                continue outerLoop;
            }
            // debugger

            if (this.board[neighborRow][neighborCol].team === this.turn) {
                continue;
            } else if (
                this.board[neighborRow][neighborCol].team !== this.turn &&
                this.board[neighborRow][neighborCol].team !== "" &&
                infiniteSpaces.includes(objectPiece.piece)
            ) {
                neighbors.push(neighbor);
                continue;
            }

            if (infiniteSpaces.includes(objectPiece.piece)) {
                // Keep checking neighbor of that neighbor with a for loop or while loop, until you hit off the board or a spot is taken
                let neighborOfNeighbor = [neighborRow, neighborCol];
                while (true) {
                    const [row, col] = neighborOfNeighbor;
                    neighborOfNeighbor = [row + rowMove, col + colMove];
                    const [nonRow, nonCol] = neighborOfNeighbor;

                    if (goesOffBoard([nonRow, nonCol])) {
                        break;
                    }

                    if (this.board[nonRow][nonCol].team === "") {
                        neighbors.push(neighborOfNeighbor);
                    } else if (this.board[nonRow][nonCol].team !== this.turn) {
                        neighbors.push(neighborOfNeighbor);
                        break;
                    } else {
                        break;
                    }
                }
            }

            neighbors.push(neighbor);
        }

        return neighbors;
    }

    checkWinner() {
        let containsWhite = false;
        let containsBlack = false;

        for (let i = 0; i < this.board.length; i++) {
            const row = this.board[i];
            for (let j = 0; j < row.length; j++) {
                const { piece, team } = row[j];
                if (piece === "KING" && team === "WHITE") {
                    containsWhite = true;
                } else if (piece === "KING" && team === "BLACK") {
                    containsBlack = true;
                }
            }
        }
        // Return null if no winner found
        return !containsWhite ? "BLACK" : !containsBlack ? "WHITE" : null;
    }

    evaluate(maximizingColor) {
        const pieceScores = {
            PAWN: 10,
            KNIGHT: 30,
            BISHOP: 30,
            ROOK: 50,
            QUEEN: 90,
            KING: 900,
        };

        let whiteScore = 0;
        let blackScore = 0;

        for (let i = 0; i < this.BOARDSIZE; i++) {
            for (let j = 0; j < this.BOARDSIZE; j++) {
                if (this.board[i][j].team === "WHITE") {
                    whiteScore += pieceScores[this.board[i][j].piece];
                } else if (this.board[i][j].team === "BLACK") {
                    blackScore += pieceScores[this.board[i][j].piece];
                }
            }
        }

        // if (maximizingColor === "WHITE") {
        //     return whiteScore - blackScore;
        // } else {
        //     return blackScore - whiteScore;
        // }
        return (`WHITE: ${whiteScore} BLACK: ${blackScore}`)
    }
}

export default chess;
