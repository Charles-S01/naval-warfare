export default function Spot({
    row,
    col,
    isUserGrid,
    addShipCoord,
    isShip,
    handleAttackSpot,
    userSpotAttack,
    oppSpotAttack,
}) {
    function handleSpotClick() {
        if (isUserGrid) {
            addShipCoord({ row, col })
        } else {
            handleAttackSpot({ row, col })
        }
    }

    const isUserSpotAttacked = isUserGrid && userSpotAttack
    const isOppSpotAttacked = !isUserGrid && oppSpotAttack

    const isUserSpotHit = isUserSpotAttacked && userSpotAttack.type === "HIT"
    const isUserSpotMiss = isUserSpotAttacked && userSpotAttack.type === "MISS"
    const isOppSpotHit = isOppSpotAttacked && oppSpotAttack.type === "HIT"
    const isOppSpotMiss = isOppSpotAttacked && oppSpotAttack.type === "MISS"

    // if (isUserSpotAttacked) {
    //     console.log(
    //         `User board at (${row}, ${col}) is attacked (${userSpotAttack.HIT ? "HIT" : "MISS"})`,
    //     )
    // } else if (isOppSpotAttacked) {
    //     console.log(`Opp board at (${row}, ${col}) is attacked (${oppSpotAttack.HIT ? "HIT" : "MISS"})`)
    // }

    return (
        <>
            <div
                onClick={handleSpotClick}
                className={`${isUserGrid && isShip ? "bg-zinc-400" : "bg-sky-200"} flex items-center justify-center hover:cursor-pointer hover:brightness-90`}
            >
                {/* <p>{`${r}, ${c}`}</p> */}
                <div
                    className={`${isUserSpotHit ? "bg-red-500" : isUserSpotMiss ? "bg-sky-500" : isOppSpotHit ? "bg-red-500" : isOppSpotMiss ? "bg-sky-500" : null} h-3/5 w-3/5 rounded-4xl`}
                ></div>
            </div>
        </>
    )
}
