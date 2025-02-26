export default function Spot({ r, c, isUserGrid, submitShipCoords }) {
    return (
        <>
            <div
                onClick={() => {
                    if (isUserGrid) {
                        submitShipCoords({ r, c })
                    }
                }}
                className="bg-sky-200 hover:cursor-pointer hover:brightness-90"
            >
                <p>{`${r}, ${c}`}</p>
            </div>
        </>
    )
}
