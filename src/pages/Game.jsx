import { useContext, useEffect, useMemo, useState } from "react"
import { AppContext } from "../App"
import Spot from "../components/Spot"
import { useNavigate } from "react-router-dom"

export default function Game(params) {
    const navigate = useNavigate()
    const { socket, userGrid, game } = useContext(AppContext)

    const gameId = useMemo(() => {
        return localStorage.getItem("gameId")
    }, [])
    const playerId = useMemo(() => {
        return localStorage.getItem("playerId")
    })

    function submitShipCoords({ r, c }) {
        socket.emit("placeShips", { gameId, playerId, r, c })
    }

    function renderGrid({ isUserGrid }) {
        const coords = []
        for (let r = 0; r < 10; r++) {
            for (let c = 0; c < 10; c++) {
                coords.push(
                    <>
                        <Spot
                            r={r}
                            c={c}
                            isUserGrid={isUserGrid}
                            submitShipCoords={submitShipCoords}
                        />
                    </>,
                )
            }
        }
        return coords
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
                {game?.Players.length === 2 && (
                    <>
                        <div className="game-area flex flex-1 items-center justify-evenly">
                            <div className="user-fleet flex flex-col gap-10">
                                <p className="rounded-lg bg-pink-600 p-3 text-center text-white">
                                    <strong>YOUR FLEET</strong>
                                </p>
                                <div className="grid">
                                    {renderGrid({ isUserGrid: true })}
                                </div>
                                <div className="ships flex">
                                    <div className="rounded-lg border-2 border-gray-400 bg-gray-200 p-1">
                                        <button>Ship</button>
                                    </div>
                                </div>
                            </div>

                            <div className="opponent-fleet flex flex-col gap-10">
                                <p className="rounded-lg bg-stone-500 p-3 text-center text-white">
                                    <strong>OPPONENT'S FLEET</strong>
                                </p>
                                <div className="grid">
                                    {renderGrid({ isUserGrid: false })}
                                </div>
                                <div className="ships flex">
                                    <div className="rounded-lg border-2 border-gray-400 bg-gray-200 p-1">
                                        <button>Ship</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
                <div className="leave-game p-4">
                    <button
                        onClick={endGame}
                        className="rounded-lg bg-red-500 p-2 text-white"
                    >
                        <strong>End game</strong>
                    </button>
                </div>
            </div>
        </>
    )
}
