import { useEffect, useState } from "react";
import utils from "../classes/utils";
import chess from "../classes/chess";
import Piece from "./Piece";

const Game = () => {
    const [game, setGame] = useState(new chess());
    const [selectedPiece, setSelectedPiece] = useState<number[] | null>(null);
    const [neighbors, setNeighbors] = useState<Array<number[]> | null>(null);

    useEffect(() => {
        console.log(game.checkWinner());
        console.log(game.evaluate());
        resetSelections();
    }, [game]);

    useEffect(() => {
        if (selectedPiece === null) {
            setNeighbors(null);
        }
    }, [selectedPiece]);

    // Could just run these everytime game updates?
    const resetSelections = () => {
        setSelectedPiece(null);
        setNeighbors(null);
    };

    const updateTurn = () => {
        setGame((prevGame) => {
            return Object.setPrototypeOf(
                {
                    ...prevGame,
                    turn: prevGame.turn === "WHITE" ? "BLACK" : "WHITE",
                },
                chess.prototype
            );
        });
    };

    const movePiece = (pos: number[], dest: number[]) => {
        // This function will do the moving because if you modify the object it won't trigger a rerender
        // Can also give the class this same function, for non UI
        // TODO: Test the current implementation of getting valid moves
        // TODO: Complete movePiece for rerendeer, and on chess class (for the minimax function)
        // TODO: Complete a evaluation function that returns score of black pieces - white pieces or vice versa
        // TODO: Complete a checkWinner function that checks if black has no king then white wins and vice versa

        // FIRST make get valid moves return double array with pos and dest
        const [posRow, posCol] = pos;
        const [destRow, destCol] = dest;

        const copyObject = Object.setPrototypeOf({ ...game }, chess.prototype);
        copyObject.board[destRow][destCol].team =
            copyObject.board[posRow][posCol].team;
        copyObject.board[destRow][destCol].piece =
            copyObject.board[posRow][posCol].piece;
        copyObject.board[posRow][posCol].team = "";
        copyObject.board[posRow][posCol].piece = "";

        if (
            copyObject.board[destRow][destCol].team === "WHITE" &&
            copyObject.board[destRow][destCol].piece === "PAWN" &&
            destRow === 0
        ) {
            copyObject.board[destRow][destCol].piece = "QUEEN";
        } else if (
            copyObject.board[destRow][destCol].team === "BLACK" &&
            copyObject.board[destRow][destCol].piece === "PAWN" &&
            destRow === 7
        ) {
            copyObject.board[destRow][destCol].piece = "QUEEN";
        }

        setGame(copyObject);

        updateTurn();
    };

    const getPossibleMoves = (pos: number[]) => {
        // If selectedPiece already equals the pos, then just unselected the piece
        if (utils.compareArrays(selectedPiece, pos)) {
            setSelectedPiece(null);
        } else {
            setSelectedPiece(pos);
            setNeighbors(game.getNeighbors(pos));
        }
    };

    return (
        <>
            <div className="grid grid-rows-8 grid-cols-8 max-w-screen-lg absolute left-0 right-0 ml-auto mr-auto">
                {game.board.map((array, row) =>
                    array.map((element, col) => {
                        return (
                            <Piece
                                key={`${row}, ${col}`}
                                element={element}
                                selectedPiece={selectedPiece}
                                neighbors={neighbors}
                                movePiece={movePiece}
                                getPossibleMoves={getPossibleMoves}
                                game={game}
                            />
                        );
                    })
                )}
            </div>
            <div>
                <h1>{`Current turn: ${game.turn}`}</h1>
                <button onClick={updateTurn}>UPDATE TURN</button>
            </div>
        </>
    );
};

export default Game;
