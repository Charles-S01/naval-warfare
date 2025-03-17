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
}) {
    function handleSpotClick() {
        if (isUserGrid) {
            addShipCoord({ row, col })
        } else {
            handleAttackSpot({ row, col })
        }
    }

    const isShip =
        userBoardCoords?.some(
            (coord) => coord.row === row && coord.col === col && coord.shipType,
        ) ||
        userShipCoordsSelection.some((el) => el.row === row && el.col === col) ||
        shipStartEndCoords.some((el) => el.row === row && el.col === col)

    const userSpotAttack = userBoardCoords.find(
        (coord) => coord.row === row && coord.col === col && coord.isHit !== null,
    )

    const oppSpotAttack = oppBoardCoords.find(
        (coord) => coord.row === row && coord.col === col && coord.isHit !== null,
    )

    return (
        <>
            <div
                onClick={handleSpotClick}
                className={`${isUserGrid && isShip ? "bg-zinc-400" : "bg-sky-200"} flex items-center justify-center hover:cursor-pointer hover:brightness-90`}
            >
                {/* <p>{`${r}, ${c}`}</p> */}
                <div
                    className={`${isUserGrid && userSpotAttack?.isHit ? "bg-red-500" : isUserGrid && userSpotAttack && !userSpotAttack.isHit ? "bg-sky-500" : !isUserGrid && oppSpotAttack?.isHit ? "bg-red-500" : !isUserGrid && oppSpotAttack && !oppSpotAttack.isHit ? "bg-sky-500" : null} h-3/5 w-3/5 rounded-4xl`}
                ></div>
            </div>
        </>
    )
}
