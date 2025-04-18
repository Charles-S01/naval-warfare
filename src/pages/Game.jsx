import { useContext, useEffect, useMemo, useState } from "react"
import { AppContext } from "../App"
import Spot from "../components/Spot"
import { useNavigate } from "react-router-dom"

export default function Game(params) {
    const navigate = useNavigate()
    const { game, retrieveGame, placeShip, deleteGame, attack, canAttack } = useContext(AppContext)
    const [shipStartEndCoords, setShipStartEndCoords] = useState([])
    const [didUserClickSubmitShip, setDidUserClickSubmitShip] = useState(false)

    useEffect(() => {
        localStorage.removeItem("isReloaded")
        async function getGame() {
            const gameId = localStorage.getItem("gameId")
            if (gameId) {
                const gameFromRetrieve = await retrieveGame(gameId)
                if (!gameFromRetrieve) {
                    navigate("/")
                }
            } else {
                navigate("/")
            }
        }
        if (!game) {
            getGame()
        }
    }, [game])

    const gameId = game?.id
    const playerId = localStorage.getItem("playerId")

    const isGameFull = game && game.players.length === 2

    const isUserTurn = game && game.playerTurnId === playerId
    const isWinner = game && game.winnerId === playerId
    const isLoser = game && game.winnerId && game.winnerId !== playerId

    const isAllPlayersShipsReady =
        game &&
        game?.players[0].gameboard.ships.length > 0 &&
        game?.players[1].gameboard.ships.length > 0
            ? true
            : false

    const { isUserShipReady } = useMemo(() => {
        const user = game?.players.find((p) => p.id === playerId)
        const isUserShipReady = user?.gameboard?.ships.length === 1
        return { isUserShipReady }
    }, [game])

    const msg = !game
        ? "Connecting..."
        : isWinner
          ? "You won!"
          : isLoser
            ? "You lost!"
            : !isGameFull
              ? "Waiting for opponent to join..."
              : !isAllPlayersShipsReady
                ? "Place ship on your board"
                : isAllPlayersShipsReady && isUserTurn
                  ? "Your turn to attack"
                  : isAllPlayersShipsReady && !isUserTurn
                    ? `Opponent's turn to attack`
                    : null

    const { oppId, oppBoardId } = useMemo(() => {
        let oppId = null
        let oppBoardId = null
        if (isGameFull) {
            const oppPlayer = game.players.find((p) => p.id !== playerId)
            oppId = oppPlayer.id
            oppBoardId = oppPlayer.gameboard.id
        }
        return { oppId, oppBoardId }
    }, [game])

    // ship coords that the user is selecting
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
        // console.log("valid end coords:", validEndCoords)
        if (shipStartEndCoords.length == 2) {
            const startCoord = shipStartEndCoords[0]
            const endCoord = shipStartEndCoords[1]
            // check if endcoord is valid and fill in coords from start to end
            if (validEndCoords.some((el) => el.row === endCoord.row && el.col === endCoord.col)) {
                // console.log("valid end spot")
                const gameboard = game.players.find((p) => p.id === playerId).gameboard
                if (startCoord.row === endCoord.row) {
                    const startCol = Math.min(startCoord.col, endCoord.col)
                    const endCol = Math.max(startCoord.col, endCoord.col)
                    for (let i = startCol; i <= endCol; i++) {
                        userShipCoordsSelection.push({
                            row: startCoord.row,
                            col: i,
                            // shipType: "CARRIER",
                        })
                    }
                } else if (startCoord.col === endCoord.col) {
                    const startRow = Math.min(startCoord.row, endCoord.row)
                    const endRow = Math.max(startCoord.row, endCoord.row)
                    for (let i = startRow; i <= endRow; i++) {
                        userShipCoordsSelection.push({
                            row: i,
                            col: startCoord.col,
                            // shipType: "CARRIER",
                        })
                    }
                }
            } else {
                // console.log("invalid end spot")
                setShipStartEndCoords([shipStartEndCoords[0]])
            }
        }
        return { userShipCoordsSelection, validEndCoords }
    }, [shipStartEndCoords])

    // get coordinates from game instance
    const { userBoardCoords, oppBoardCoords } = useMemo(() => {
        let userBoardCoords = []
        let oppBoardCoords = []
        if (isAllPlayersShipsReady) {
            const player = game.players.find((p) => p.id === playerId)
            const oppPlayer = game.players.find((p) => p.id !== playerId)

            userBoardCoords = player.gameboard?.coordinates
            oppBoardCoords = oppPlayer.gameboard?.coordinates
        }
        return { userBoardCoords, oppBoardCoords }
    }, [game])

    function addShipCoord({ row, col }) {
        if (!isAllPlayersShipsReady && shipStartEndCoords.length < 2) {
            // console.log(`Added ship at (${row}, ${col})`)
            setShipStartEndCoords([...shipStartEndCoords, { row, col }])
        }
    }

    async function submitShipCoords() {
        if (!didUserClickSubmitShip && !isUserShipReady && shipStartEndCoords.length === 2) {
            // console.log("submitShipCoords")
            setDidUserClickSubmitShip(true)
            await placeShip({ gameId, playerId, coords: userShipCoordsSelection })
        }
    }

    async function handleAttackSpot({ row, col }) {
        if (isAllPlayersShipsReady && isUserTurn && !(isWinner || isLoser) && canAttack) {
            attack({ row, col, gameId, playerId, oppId })
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
                            validEndCoords={validEndCoords}
                            handleAttackSpot={handleAttackSpot}
                            isShipsSubmitted={didUserClickSubmitShip}
                        />
                    </>,
                )
            }
        }
        return spots
    }

    async function endGame() {
        await deleteGame(gameId)
        localStorage.setItem("isReloaded", true)
        navigate("/")
    }

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
                {game?.players.length === 2 && (
                    <>
                        <div className="game-area mt-10 flex flex-1 items-baseline justify-evenly gap-8">
                            <div className="user-fleet flex flex-col gap-10">
                                <p className="rounded-lg bg-sky-600 p-3 text-center text-white">
                                    <strong>YOUR FLEET</strong>
                                </p>
                                <div className="grid">{renderGrid({ isUserGrid: true })}</div>
                                <div className="ships flex gap-2 text-white">
                                    {/* <div className="text-white"> */}
                                    {!isUserShipReady && (
                                        <>
                                            <button
                                                disabled={isUserShipReady || didUserClickSubmitShip}
                                                onClick={submitShipCoords}
                                                className={`rounded-lg border-2 border-green-600 p-2 text-green-600 hover:bg-green-600 hover:text-white`}
                                            >
                                                <strong>Done</strong>
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="opponent-fleet flex flex-col gap-10">
                                <p className={`rounded-lg bg-stone-500 p-3 text-center text-white`}>
                                    <strong>OPPONENT'S FLEET</strong>
                                </p>
                                <div className={`${!canAttack && "brightness-95"} grid`}>
                                    {renderGrid({ isUserGrid: false })}
                                </div>
                            </div>
                        </div>
                    </>
                )}
                <div className="leave-game p-4">
                    <button
                        onClick={endGame}
                        className="rounded-lg border-2 border-red-500 p-2 text-red-500 hover:bg-red-500 hover:text-white"
                    >
                        <strong>End game</strong>
                    </button>
                </div>
            </div>
        </>
    )
}
