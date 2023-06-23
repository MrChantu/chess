import { useEffect, useState } from "react";
import utils from "../classes/utils";
import chess from "../classes/chess";
import Piece from "./Piece";

const Game = () => {
    const [game, setGame] = useState(new chess());
    const [selectedPiece, setSelectedPiece] = useState<number[] | null>(null);
    const [neighbors, setNeighbors] = useState<Array<number[]> | null>(null);
    const [isGameOver, setGameOver] = useState(false);
    const [winner, setWinner] = useState<string | null>(null);

    let ranOnce = false;

    useEffect(() => {
        resetSelections();

        const winner = game.checkWinner();

        if (winner !== null) {
            setGameOver(true);
            setWinner(winner);
        }

        if (game.turn === "BLACK" && ranOnce === false) {
            // After turn updates, run computerMove
            // Will be ran after white, so color will be BLACK and maximizingPlayer true?
            setTimeout(() => {
                const computerMove = game.generateMove(
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    true,
                    "BLACK"
                );
                // console.log(computerMove);
                const [pos, move] = computerMove[0];
                movePiece(pos, move);
            }, 1000);
            ranOnce = true;
        }
    }, [game]);

    useEffect(() => {
        if (selectedPiece === null) {
            setNeighbors(null);
        }
    }, [selectedPiece]);

    const handleReset = () => {
        setGame(new chess());
        setWinner(null);
        setGameOver(false);
    };

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
            {isGameOver && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-200 rounded flex flex-col">
                    <h1>{`Winner: ${winner}`}</h1>
                    <button onClick={handleReset}>RESET</button>
                </div>
            )}
        </>
    );
};

export default Game;
