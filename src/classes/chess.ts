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
        // give pawns a isFirstMove boolean to handle allowing 2 or 1 squares?
        this.board = this.generateBoard();
        this.turn = "BLACK";
    }

    generateBoard() {
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

        return arr;
    }
    getAllValidMoves() {
        // Returns all possible moves for the current turn team
        const allMoves = [];

        if (this.turn === "WHITE") {
            for (let i = 0; i < this.BOARDSIZE; i++) {
                for (let j = 0; j < this.BOARDSIZE; j++) {
                    if (this.board[i][j].team === "WHITE") {
                        const moves = this.getNeighbors([i, j]);
                        if (moves.length > 0) {
                            moves.forEach((move) => {
                                const [row, col] = move;
                                allMoves.push([
                                    [i, j],
                                    [row, col],
                                ]);
                            });
                        }
                    }
                }
            }
        } else if (this.turn === "BLACK") {
            for (let i = 0; i < this.BOARDSIZE; i++) {
                for (let j = 0; j < this.BOARDSIZE; j++) {
                    if (this.board[i][j].team === "BLACK") {
                        const moves = this.getNeighbors([i, j]);
                        if (moves.length > 0) {
                            moves.forEach((move) => {
                                const [row, col] = move;
                                allMoves.push([
                                    [i, j],
                                    [row, col],
                                ]);
                            });
                        }
                    }
                }
            }
        }

        return allMoves;
    }

    getNeighbors(pos: Array<number>) {
        // Returns all possible moves for a given piece position
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

    evaluate(game = this, maximizingColor) {
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
                if (game.board[i][j].team === "WHITE") {
                    whiteScore += pieceScores[game.board[i][j].piece];
                } else if (game.board[i][j].team === "BLACK") {
                    blackScore += pieceScores[game.board[i][j].piece];
                }
            }
        }

        if (maximizingColor === "WHITE") {
            return whiteScore - blackScore;
        } else {
            return blackScore - whiteScore;
        }
    }

    updateTurn() {
        this.turn === "WHITE" ? "BLACK" : "WHITE";
    }

    placeMove(pos: number[], dest: number[]) {
        const [posRow, posCol] = pos;
        const [destRow, destCol] = dest;

        this.board[destRow][destCol].team = this.board[posRow][posCol].team;
        this.board[destRow][destCol].piece = this.board[posRow][posCol].piece;
        this.board[posRow][posCol].team = "";
        this.board[posRow][posCol].piece = "";

        if (
            this.board[destRow][destCol].team === "WHITE" &&
            this.board[destRow][destCol].piece === "PAWN" &&
            destRow === 0
        ) {
            this.board[destRow][destCol].piece = "QUEEN";
        } else if (
            this.board[destRow][destCol].team === "BLACK" &&
            this.board[destRow][destCol].piece === "PAWN" &&
            destRow === 7
        ) {
            this.board[destRow][destCol].piece = "QUEEN";
        }
    }
    // depth = 4 seems to be fast, and anything higher takes like 10 years
    generateMove(game = this, depth = 3, alpha, beta, maximizingPlayer, maximizingColor) {
        // Depth will be subtracted from every time this function is ran, (not sure is this.evaluate will evaluate correctly for the board that is inputted)
            if (depth === 0 || game.checkWinner() !== null) {
                return game.evaluate(game, maximizingColor);
            }

            const moves = game.getAllValidMoves();
            let bestMove = moves[Math.floor(Math.random() * moves.length)];

            if (maximizingPlayer) {
                let maxEval = -Infinity;
                for (let i = 0; i < moves.length; i++) {
                    const move = moves[i];
                    const copyGame = Object.setPrototypeOf(
                        JSON.parse(JSON.stringify(game)),
                        chess.prototype
                    );
                    copyGame.placeMove(move[0], move[1]);
                    copyGame.turn = "WHITE"

                    const currentEval = game.generateMove(copyGame, depth - 1, alpha, beta, false, maximizingColor)
                    if (currentEval[1] > maxEval) {
                        maxEval = currentEval[1]
                        bestMove = move
                    }
                    alpha = Math.max(alpha, currentEval[1]);
                    if (beta <= alpha) break;
                }
                return [bestMove, maxEval]
            } else {
                let minEval = Infinity;
                for (let i = 0; i < moves.length; i++) {
                    const move = moves[i];
                    const copyGame = Object.setPrototypeOf(
                        JSON.parse(JSON.stringify(game)),
                        chess.prototype
                    );
                    copyGame.placeMove(move[0], move[1]);
                    copyGame.turn = "BLACK"
                    const currentEval = game.generateMove(copyGame, depth - 1, alpha, beta, true, maximizingColor)
                    if (currentEval[1] < minEval) {
                        minEval = currentEval[1]
                        bestMove = move
                    }
                    beta = Math.min(beta, currentEval[1]);
                    if (beta <= alpha) break;
                }
                return [bestMove, minEval]
            }
        }
    
}

export default chess;
