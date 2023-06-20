import { useEffect, useState } from "react";
import chess from "../classes/chess";

const Game = () => {
    const [game, setGame] = useState(new chess());
    const [selectedPiece, setSelectedPiece] = useState<number[] | null>(null);
    const [neighbors, setNeighbors] = useState<Array<number[]> | null>(null);

    useEffect(() => {
        console.log(game);
        resetSelections();
    }, [game]);

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

    const movePiece = (pos: number[]) => {
        console.log(`Move to: ${pos}`);
    };

    const handleClick = (pos: number[]) => {
        console.log(game);
        const [row, col] = pos;
        setSelectedPiece([row, col]);
        setNeighbors(game.getNeighbors([row, col]));
        console.log(row, col);
        console.log(game.getNeighbors([row, col]));
    };

    function compareArrays(arr1: number[], arr2: number[]): boolean {
        if (arr1.length !== arr2.length) {
            return false;
        }
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) {
                return false;
            }
        }
        return true;
    }

    return (
        <>
            <div className="grid grid-rows-8 grid-cols-8 max-w-screen-lg">
                {game.board.map((x, row) =>
                    x.map((y, col) => {
                        const selectedPieceStyle = {
                            backgroundColor: "gray",
                        };
                        const neighborPieceStyle = {
                            backgroundColor: "green",
                            cursor: "pointer",
                        };
                        const isNeighbor = neighbors?.some((arr) =>
                            compareArrays(arr, [row, col])
                        );
                        const isSelectedPiece =
                            selectedPiece &&
                            compareArrays(selectedPiece, [row, col]);

                        const mergedStyle = Object.assign(
                            {},
                            isSelectedPiece && selectedPieceStyle,
                            isNeighbor && neighborPieceStyle
                        );

                        return (
                            <div
                                key={`${row},${col}`}
                                className="flex relative border border-black items-center justify-center w-full pb-[100%]"
                                style={mergedStyle}
                                onClick={
                                    // TODO: Make this look better
                                    y !== null && !isNeighbor
                                        ? () => handleClick([row, col])
                                        : isNeighbor
                                        ? () => movePiece([row, col])
                                        : undefined
                                }
                            >
                                <div className="absolute top-0 bottom-0 left-0 right-0">
                                    {y}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
            <h1>{`Current turn: ${game.turn}`}</h1>
            <button onClick={updateTurn}>UPDATE TURN</button>
        </>
    );
};

export default Game;
