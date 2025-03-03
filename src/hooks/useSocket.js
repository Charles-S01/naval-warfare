import { useState } from "react"
import { io } from "socket.io-client"

export default function useSocket(params) {
    const [game, setGame] = useState()
    const [msg, setMsg] = useState()
    const [isFullGame, setIsFullGame] = useState(false)

    const socket = io("http://localhost:3000")

    socket.on("userJoin", ({ msg, game }) => {
        console.log("USER JOINED")
        console.log(game)
        setMsg(msg)
        setGame(game)
        localStorage.setItem("game", game)
    })

    socket.on("startGame", (game) => {
        setGame(game)
        console.log(game)
    })

    socket.on("attackAttempt", (game) => {
        console.log("Attack attempt")
        console.log(game)
        setGame(game)
    })

    return { socket, msg, game }
}
