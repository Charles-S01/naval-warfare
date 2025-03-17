import { useContext, useMemo, useState } from "react"
import useSocket from "../hooks/useSocket"
import { AppContext } from "../App"
import { useNavigate } from "react-router-dom"

export default function Home(params) {
    const navigate = useNavigate()
    const { socket } = useContext(AppContext)
    const [message, setMessage] = useState()
    const [gameIdInput, setGameIdInput] = useState()
    const [errorMsg, setErrorMsg] = useState()

    const gameIdStorage = localStorage.getItem("gameId")

    async function createGame() {
        const response = await socket.emitWithAck("createGame", {
            existingGameId: gameIdStorage ? gameIdStorage : null,
        })
        localStorage.setItem("gameId", response.gameId)
        localStorage.setItem("playerId", response.playerId)
        navigate("/game")
    }

    async function joinGame(e) {
        e.preventDefault()
        try {
            const response = await socket.emitWithAck("joinGame", {
                gameIdInput,
            })
            if (response.joined) {
                localStorage.setItem("gameId", response.gameId)
                localStorage.setItem("playerId", response.playerId)
                navigate("/game")
            } else {
                setErrorMsg(response.errorMsg)
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <div className="m-0 flex h-full w-full items-center justify-center p-0">
                <div className="flex flex-col gap-2 p-4">
                    <div className="box flex flex-col items-center gap-4">
                        <button
                            onClick={createGame}
                            className="rounded-lg bg-green-500 p-2 text-white"
                        >
                            <p className="text-3xl">Start a game</p>
                        </button>
                        <p>Or</p>
                        <form onSubmit={joinGame} className="flex items-end gap-2">
                            <label className="flex flex-col gap-1">
                                <p>Join a game with game ID: </p>
                                <input
                                    placeholder="Game ID"
                                    type="text"
                                    onChange={(e) => setGameIdInput(e.target.value)}
                                    className="rounded-lg bg-white p-2"
                                />
                            </label>
                            <button className="rounded-lg bg-blue-200 p-2 hover:cursor-pointer">
                                Enter
                            </button>
                        </form>
                        <p className="text-red-500">{errorMsg && errorMsg}</p>
                    </div>
                </div>
            </div>
        </>
    )
}
