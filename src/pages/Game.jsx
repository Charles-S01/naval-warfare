import { useContext, useEffect, useMemo, useState } from "react"
import { AppContext } from "../App"
import Spot from "../components/Spot"
import { useNavigate } from "react-router-dom"

export default function Game(params) {
    const navigate = useNavigate()
    const { socket, game } = useContext(AppContext)
    const [shipStartEndCoords, setShipStartEndCoords] = useState([])
    const [isShipsSubmitted, setIsShipsSubmitted] = useState(false)
    const [canAttack, setCanAttack] = useState(true)
    // const [shipTypeSelection, setShipTypeSelection] = useState(null)
    const isShipsSet = game && game?.playersReadyCount === 2 ? true : false

    const gameId = localStorage.getItem("gameId")
    const playerId = localStorage.getItem("playerId")

    const isGameFull = game && game.Players.length === 2
    const isUserTurn = game && game.playerTurn === playerId
    const isWinner = game && game.winner === playerId
    const isLoser = game && game.winner && game.winner !== playerId

    console.log("start and end selected:", shipStartEndCoords)

    const msg = isWinner
        ? "You won"
        : isLoser
          ? "You lost"
          : !isGameFull
            ? "Waiting for opponent to join..."
            : !isShipsSet
              ? "Place ship on your board"
              : isShipsSet && isUserTurn
                ? "Your turn to attack"
                : isShipsSet && !isUserTurn
                  ? `Opponent's turn to attack`
                  : null

    const { oppId, oppBoardId } = useMemo(() => {
        let oppId = null
        let oppBoardId = null
        if (isGameFull) {
            const oppPlayer = game.Players.find((p) => p.id !== playerId)
            oppId = oppPlayer.id
            oppBoardId = oppPlayer.gameBoard.id
        }
        return { oppId, oppBoardId }
    }, [game])

    // ship coords that the user selected
    const { userShipCoordsSelection, validEndCoords } = useMemo(() => {
        let userShipCoordsSelection = []
        let validEndCoords = []
        if (shipStartEndCoords.length > 0) {
            const s = shipStartEndCoords[0]
            if (s.row + 4 < 10) {
                validEndCoords.push({ row: s.row + 4, col: s.col })
            }
            if (s.row - 4 >= 0) {
                validEndCoords.push({ row: s.row - 4, col: s.col })
            }
            if (s.col + 4 < 10) {
                validEndCoords.push({ row: s.row, col: s.col + 4 })
            }
            if (s.col - 4 >= 0) {
                validEndCoords.push({ row: s.row, col: s.col - 4 })
            }
        }
        console.log("valid end coords:", validEndCoords)
        if (shipStartEndCoords.length == 2) {
            const startCoord = shipStartEndCoords[0]
            const endCoord = shipStartEndCoords[1]
            // check if endcoord is valid and fill in coords from start to end
            if (validEndCoords.some((el) => el.row === endCoord.row && el.col === endCoord.col)) {
                console.log("valid end spot")
                if (startCoord.row === endCoord.row) {
                    const startCol = Math.min(startCoord.col, endCoord.col)
                    const endCol = Math.max(startCoord.col, endCoord.col)
                    for (let i = startCol; i <= endCol; i++) {
                        userShipCoordsSelection.push({ row: startCoord.row, col: i })
                    }
                } else if (startCoord.col === endCoord.col) {
                    const startRow = Math.min(startCoord.row, endCoord.row)
                    const endRow = Math.max(startCoord.row, endCoord.row)
                    for (let i = startRow; i <= endRow; i++) {
                        userShipCoordsSelection.push({ row: i, col: startCoord.col })
                    }
                }
            } else {
                console.log("invalid end spot")
                setShipStartEndCoords([shipStartEndCoords[0]])
            }
        }
        return { userShipCoordsSelection, validEndCoords }
    }, [shipStartEndCoords])

    // get coordinates from game instance
    const { userBoardCoords, oppBoardCoords } = useMemo(() => {
        let userBoardCoords = []
        let oppBoardCoords = []
        if (isShipsSet) {
            const player = game.Players.find((p) => p.id === playerId)
            const oppPlayer = game.Players.find((p) => p.id !== playerId)

            userBoardCoords = player.gameBoard.Coordinates
            oppBoardCoords = oppPlayer.gameBoard.Coordinates
        }
        return { userBoardCoords, oppBoardCoords }
    }, [game])

    function addShipCoord({ row, col }) {
        if (!isShipsSet && shipStartEndCoords.length < 2) {
            console.log(`Added ship at (${row}, ${col})`)
            setShipStartEndCoords([...shipStartEndCoords, { row, col }])
        }
    }

    function submitShipCoords() {
        if (!isShipsSet || (!isShipsSubmitted && shipStartEndCoords.length > 0)) {
            setIsShipsSubmitted(true)
            socket.emit("placeShips", { gameId, playerId, userShipCoordsSelection })
        }
    }

    async function handleAttackSpot({ row, col }) {
        if (isShipsSet && isUserTurn && !(isWinner || isLoser) && canAttack) {
            setCanAttack(false)
            const response = await socket.emitWithAck("attackSpot", {
                gameId,
                playerId,
                oppId,
                oppBoardId,
                row,
                col,
            })
            setCanAttack(true)
        }
    }

    function renderGrid({ isUserGrid }) {
        const spots = []
        for (let r = 0; r < 10; r++) {
            for (let c = 0; c < 10; c++) {
                spots.push(
                    <>
                        <Spot
                            key={{ r, c }}
                            row={r}
                            col={c}
                            isUserGrid={isUserGrid}
                            addShipCoord={addShipCoord}
                            userBoardCoords={userBoardCoords}
                            oppBoardCoords={oppBoardCoords}
                            userShipCoordsSelection={userShipCoordsSelection}
                            shipStartEndCoords={shipStartEndCoords}
                            handleAttackSpot={handleAttackSpot}
                        />
                    </>,
                )
            }
        }
        return spots
    }

    function endGame() {
        socket.emit("endGame", gameId)
        navigate("/")
    }

    socket.on("endGame", () => {
        console.log("game ended")
        navigate("/")
    })

    return (
        <>
            <div className="page box-border flex h-full w-full flex-col gap-4 overflow-auto">
                <div className="id flex flex-col p-4">
                    <p>Game ID:</p>
                    <p>{gameId && gameId}</p>
                </div>
                <div className="self-center text-3xl">
                    <p>
                        <strong>{msg}</strong>
                    </p>
                </div>
                {game?.Players.length === 2 && (
                    <>
                        <div className="game-area flex flex-1 items-center justify-evenly">
                            <div className="user-fleet flex flex-col gap-10">
                                <p className="rounded-lg bg-pink-600 p-3 text-center text-white">
                                    <strong>YOUR FLEET</strong>
                                </p>
                                <div className="grid">{renderGrid({ isUserGrid: true })}</div>
                                <div className="ships flex gap-2 text-white">
                                    {/* <div className="text-white"> */}
                                    {!isShipsSubmitted ? (
                                        <>
                                            <button
                                                onClick={submitShipCoords}
                                                className="rounded-lg bg-green-500 p-2 text-white"
                                            >
                                                <strong>Done</strong>
                                            </button>
                                        </>
                                    ) : null}
                                    {/* {
                                        <>
                                            <button className="rounded-lg bg-gray-500 p-2">
                                                Carrier
                                            </button>
                                            <button className="rounded-lg bg-gray-500 p-2">
                                                Submarine
                                            </button>
                                            <button className="rounded-lg bg-gray-500 p-2">
                                                Destroyer
                                            </button>
                                        </>
                                    } */}
                                    {/* </div> */}
                                </div>
                            </div>

                            <div className="opponent-fleet flex flex-col gap-10">
                                <p className="rounded-lg bg-stone-500 p-3 text-center text-white">
                                    <strong>OPPONENT'S FLEET</strong>
                                </p>
                                <div className="grid">{renderGrid({ isUserGrid: false })}</div>
                                <div className="ships flex"></div>
                            </div>
                        </div>
                    </>
                )}
                <div className="leave-game p-4">
                    <button onClick={endGame} className="rounded-lg bg-red-500 p-2 text-white">
                        <strong>End game</strong>
                    </button>
                </div>
            </div>
        </>
    )
}
