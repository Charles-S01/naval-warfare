export default function Spot({
    row,
    col,
    isUserGrid,
    addShipCoord,
    handleAttackSpot,
    userBoardCoords,
    oppBoardCoords,
    userShipCoordsSelection,
    shipStartEndCoords,
    validEndCoords,
    isShipsSubmitted,
}) {
    function handleSpotClick() {
        if (isUserGrid) {
            addShipCoord({ row, col })
        } else {
            handleAttackSpot({ row, col })
        }
    }

    const isShip =
        userBoardCoords?.some((coord) => coord.row === row && coord.col === col && coord.ship) ||
        userShipCoordsSelection.some((el) => el.row === row && el.col === col) ||
        shipStartEndCoords.some((el) => el.row === row && el.col === col)

    const userSpotAttack = userBoardCoords.find(
        (coord) => coord.row === row && coord.col === col && coord.attackResult !== null,
    )

    const oppSpotAttack = oppBoardCoords.find(
        (coord) => coord.row === row && coord.col === col && coord.attackResult !== null,
    )

    const isValidEndCoord = validEndCoords.find((el) => el.row === row && el.col === col)

    return (
        <>
            <div
                onClick={handleSpotClick}
                className={`${isUserGrid && isShip ? "bg-zinc-400" : isUserGrid && !isShipsSubmitted && isValidEndCoord ? "bg-zinc-200" : "bg-sky-200"} flex items-center justify-center hover:cursor-pointer hover:brightness-90`}
            >
                {/* <p>{`${r}, ${c}`}</p> */}
                <div
                    className={`${isUserGrid && userSpotAttack?.attackResult === "HIT" ? "bg-red-500" : isUserGrid && userSpotAttack?.attackResult === "MISS" ? "bg-sky-500" : !isUserGrid && oppSpotAttack?.attackResult === "HIT" ? "bg-red-500" : !isUserGrid && oppSpotAttack?.attackResult === "MISS" ? "bg-sky-500" : null} h-3/5 w-3/5 rounded-4xl`}
                ></div>
            </div>
        </>
    )
}
