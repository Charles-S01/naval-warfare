import { useContext, useEffect, useMemo, useState } from "react"
import useSocket from "../hooks/useSocket"
import { AppContext } from "../App"
import { useNavigate } from "react-router-dom"
import { v4 as uuidv4 } from "uuid"

export default function Home(params) {
    const navigate = useNavigate()
    const { game, createGame, joinGame, deleteGame } = useContext(AppContext)
    const [gameIdInput, setGameIdInput] = useState()
    const [errorMsg, setErrorMsg] = useState()
    const [canClickButton, setCanClickButton] = useState(true)

    // const gameIdStorage = localStorage.getItem("gameId")

    useEffect(() => {
        const isReloaded = localStorage.getItem("isReloaded")
        async function del() {
            localStorage.setItem("isReloaded", true)
            const storageGameId = localStorage.getItem("gameId")
            if (game || storageGameId) {
                console.log("game or storageGameId found, deleting game...")
                await deleteGame(game ? game.id : storageGameId)
                localStorage.removeItem("gameId")
            }
            window.location.reload()
        }
        if (!isReloaded) {
            del()
        }
    }, [])

    async function makeGame(params) {
        if (canClickButton) {
            setCanClickButton(false)
            const createdGame = await createGame()
            if (createdGame) {
                console.log("Created game")
                navigate("/game")
            } else {
                setErrorMsg("Error creating game")
            }
            setCanClickButton(true)
        }
    }

    async function join(e) {
        if (canClickButton) {
            e.preventDefault()
            setCanClickButton(false)
            const joinedGame = await joinGame(gameIdInput)
            if (joinedGame) {
                console.log("Joined game")
                navigate("/game")
            } else {
                setErrorMsg("Game is full or does not exist")
            }
            setCanClickButton(true)
        }
    }

    return (
        <>
            <div className="whole-page m-0 flex h-full w-full flex-col p-0">
                <header className="flex items-center justify-center bg-sky-200 p-4">
                    <p className="text-5xl font-bold font-stretch-expanded">Naval Warfare</p>
                </header>
                <div className="main flex flex-auto flex-col items-center justify-center gap-4 p-4">
                    <div
                        className={`${!canClickButton && "brightness-90"} box flex flex-col items-center gap-4 rounded-xl border-4 border-sky-300 bg-white p-5 shadow-2xl`}
                    >
                        <button
                            disabled={!canClickButton}
                            onClick={makeGame}
                            className="rounded-lg border-2 border-sky-700 p-2 text-sky-700 hover:bg-sky-700 hover:text-white"
                        >
                            <p className="text-3xl">Start a new game</p>
                        </button>
                        <p className="font-bold">Or</p>
                        <form onSubmit={join} className="flex items-end gap-2">
                            <label className="flex flex-col gap-1">
                                <p>Join a game with game ID: </p>
                                <input
                                    placeholder="Game ID"
                                    type="text"
                                    onChange={(e) => setGameIdInput(e.target.value)}
                                    className="rounded-lg bg-gray-100 p-2"
                                />
                            </label>
                            <button
                                disabled={!canClickButton}
                                className="rounded-lg p-2 text-sky-700 hover:cursor-pointer hover:bg-sky-100"
                            >
                                Enter
                            </button>
                        </form>
                        {errorMsg && (
                            <>
                                <p className="text-red-500">{errorMsg && errorMsg}</p>
                            </>
                        )}
                    </div>
                    {!canClickButton && (
                        <>
                            <p>Loading...</p>
                        </>
                    )}
                    <div>
                        {/* <button onClick={makeGame}>
                            <p>Test button</p>
                        </button> */}
                    </div>
                </div>
            </div>
        </>
    )
}
