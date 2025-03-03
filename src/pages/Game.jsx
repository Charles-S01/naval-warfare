import { useContext, useEffect, useMemo, useState } from "react"
import { AppContext } from "../App"
import Spot from "../components/Spot"
import { useNavigate } from "react-router-dom"

export default function Game(params) {
    const navigate = useNavigate()
    const { socket, game } = useContext(AppContext)
    const [shipCoordsSelect, setShipCoordsSelect] = useState([])
    const [isShipsSubmitted, setIsShipsSubmitted] = useState(false)
    console.log(shipCoordsSelect)
    const isShipsSet = game && game?.playersReadyCount === 2 ? true : false

    const gameId = localStorage.getItem("gameId")
    const playerId = localStorage.getItem("playerId")

    const isGameFull = game && game.Players.length === 2
    const isUserTurn = game && game.playerTurn === playerId
    const isWinner = game && game.winner === playerId
    const isLoser = game && game.winner !== playerId

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

    // get coordinates for ships and attacks from both boards
    const { userBoardShip, userBoardAttacks, oppBoardAttacks } = useMemo(() => {
        let userBoardShip = []
        let userBoardAttacks = []
        let oppBoardAttacks = []
        if (isShipsSet) {
            const player = game.Players.find((p) => p.id === playerId)
            const oppPlayer = game.Players.find((p) => p.id !== playerId)

            userBoardShip = player.gameBoard.Ships ? player.gameBoard.Ships[0].Coordinates : []
            userBoardAttacks = player.gameBoard.Attacks ? player.gameBoard.Attacks : []
            oppBoardAttacks = oppPlayer.gameBoard.Attacks ? oppPlayer.gameBoard.Attacks : []
        }
        return { userBoardShip, userBoardAttacks, oppBoardAttacks }
    }, [game])

    function addShipCoord({ row, col }) {
        if (!isShipsSet && shipCoordsSelect.length < 1) {
            console.log(`Added ship at (${row}, ${col})`)
            setShipCoordsSelect([...shipCoordsSelect, { row, col }])
        }
    }

    function submitShipCoords() {
        if (!isShipsSet || !isShipsSubmitted) {
            setIsShipsSubmitted(true)
            socket.emit("placeShips", { gameId, playerId, shipCoordsSelect })
        }
    }

    function handleAttackSpot({ row, col }) {
        if (isShipsSet && isUserTurn && !(isWinner || isLoser)) {
            socket.emit("attackSpot", { gameId, playerId, oppId, oppBoardId, row, col })
        }
    }

    function renderGrid({ isUserGrid }) {
        const spots = []
        for (let r = 0; r < 10; r++) {
            for (let c = 0; c < 10; c++) {
                let isShip = false
                if (true) {
                    isShip =
                        // userBoardShip.some((el) => el.row === r && el.col === c) ||
                        shipCoordsSelect.some((el) => el.row === r && el.col === c)
                }
                let oppSpotAttack = null
                let userSpotAttack = null
                if (isUserGrid) {
                    userSpotAttack = userBoardAttacks.find((el) => el.row === r && el.col === c)
                } else {
                    oppSpotAttack = oppBoardAttacks.find((el) => el.row === r && el.col === c)
                }
                spots.push(
                    <>
                        <Spot
                            row={r}
                            col={c}
                            isUserGrid={isUserGrid}
                            isShip={isShip}
                            addShipCoord={addShipCoord}
                            userSpotAttack={userSpotAttack}
                            oppSpotAttack={oppSpotAttack}
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
            <div className="flex h-full w-full flex-col">
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
                                <div className="ships flex">
                                    <div className="">
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
                                    </div>
                                </div>
                            </div>

                            <div className="opponent-fleet flex flex-col gap-10">
                                <p className="rounded-lg bg-stone-500 p-3 text-center text-white">
                                    <strong>OPPONENT'S FLEET</strong>
                                </p>
                                <div className="grid">{renderGrid({ isUserGrid: false })}</div>
                                <div className="ships flex">
                                    {/* <div className="rounded-lg border-2 border-gray-400 bg-gray-200 p-1">
                                        <button>Ship</button>
                                    </div> */}
                                </div>
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
