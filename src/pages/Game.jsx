import { useContext, useEffect, useMemo, useState } from "react"
import { AppContext } from "../App"
import Spot from "../components/Spot"

export default function Game(params) {
    const { socket, userGrid, isFullGame } = useContext(AppContext)

    const gameId = useMemo(() => {
        return localStorage.getItem("gameId")
    }, [])
    const playerId = useMemo(() => {
        return localStorage.getItem("playerId")
    })

    // useEffect(() => {
    //     async function joinGame() {
    //         try {
    //             // const gameId = localStorage.getItem("gameId")
    //             // const playerId = localStorage.getItem("playerId")
    //             const response = await socket.emitWithAck("joinGame", {
    //                 gameIdInput: gameId,
    //                 playerId,
    //             })
    //         } catch (error) {
    //             console.log(error)
    //         }
    //     }
    //     joinGame()
    // }, [])

    function renderGrid() {
        const coords = []
        for (let r = 0; r < 10; r++) {
            for (let c = 0; c < 10; c++) {
                coords.push(
                    <>
                        <Spot r={r} c={c} />
                    </>,
                )
            }
        }
        return coords
    }

    return (
        <>
            <div className="flex h-full w-full flex-col">
                <div className="id p-4">
                    <p>Game ID: {gameId && gameId}</p>
                </div>
                {isFullGame && (
                    <>
                        <div className="game-area flex flex-1 items-center justify-evenly">
                            <div className="user-fleet flex flex-col gap-10">
                                <p className="rounded-lg bg-pink-600 p-3 text-center text-white">
                                    <strong>YOUR FLEET</strong>
                                </p>
                                <div className="grid">{renderGrid()}</div>
                            </div>
                            <div className="opponent-fleet flex flex-col gap-10">
                                <p className="rounded-lg bg-stone-500 p-3 text-center text-white">
                                    <strong>OPPONENT'S FLEET</strong>
                                </p>
                                <div className="grid">{renderGrid()}</div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    )
}
