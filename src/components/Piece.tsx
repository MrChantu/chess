import utils from "../classes/utils";
import { ReactComponent as PawnSVG } from "../img/pawn.svg";
import { ReactComponent as RookSVG } from "../img/rook.svg";
import { ReactComponent as BishopSVG } from "../img/bishop.svg";
import { ReactComponent as KingSVG } from "../img/king.svg";
import { ReactComponent as QueenSVG } from "../img/queen.svg";
import { ReactComponent as KnightSVG } from "../img/knight.svg";

const Piece = ({
    element,
    selectedPiece,
    neighbors,
    movePiece,
    getPossibleMoves,
    game,
}) => {
    const selectedPieceStyle = {
        backgroundColor: "gray",
    };
    const neighborPieceStyle = {
        backgroundColor: "green",
        cursor: "pointer",
    };
    // To fix this just create new component for pieces, and pass in the neighbors, and if object is not null render the piece, etc.
    const isNeighbor = neighbors
        ? utils.arrayContains(neighbors, element.index)
        : false;
    const isSelectedPiece = selectedPiece && selectedPiece === element.index;

    const mergedStyle = Object.assign(
        {},
        isSelectedPiece && selectedPieceStyle,
        isNeighbor && neighborPieceStyle
    );

    const PIECEFILL = element.team === "WHITE" && "lightgray";

    const PIECEONCLICK =
        game.turn === element.team &&
        element.team === "WHITE" &&
        element.piece !== "" &&
        !isNeighbor
            ? () => getPossibleMoves(element.index)
            : undefined;

    const pieceSVGs = {
        PAWN: (
            <PawnSVG
                className="piece-svg"
                fill={PIECEFILL}
                onClick={PIECEONCLICK}
            />
        ),
        ROOK: (
            <RookSVG
                className="piece-svg"
                fill={PIECEFILL}
                onClick={PIECEONCLICK}
            />
        ),
        BISHOP: (
            <BishopSVG
                className="piece-svg"
                fill={PIECEFILL}
                onClick={PIECEONCLICK}
            />
        ),
        KING: (
            <KingSVG
                className="piece-svg"
                fill={PIECEFILL}
                onClick={PIECEONCLICK}
            />
        ),
        QUEEN: (
            <QueenSVG
                className="piece-svg"
                fill={PIECEFILL}
                onClick={PIECEONCLICK}
            />
        ),
        KNIGHT: (
            <KnightSVG
                className="piece-svg"
                fill={PIECEFILL}
                onClick={PIECEONCLICK}
            />
        ),
    };

    return (
        <div
            style={mergedStyle}
            className="flex relative border border-black items-center justify-center w-full pb-[100%]"
            onClick={
                isNeighbor
                    ? () => movePiece(selectedPiece, element.index)
                    : undefined
            }
        >
            {/* <div className="absolute top-5 left-5 text-red-500 z-10 ">{`${element.index[0]}, ${element.index[1]}`}</div> */}
            {/* movePiece not work with this line */}
            {/* And need logic for white and black colors (if white make it white somehow) */}
            {element.team !== "" && pieceSVGs[element.piece]}
        </div>
    );
};

export default Piece;
