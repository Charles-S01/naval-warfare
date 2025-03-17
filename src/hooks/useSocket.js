import { useState } from "react"
import { io } from "socket.io-client"

export default function useSocket(params) {
    const [game, setGame] = useState()

    const socketUrl = import.meta.env.VITE_SOCKET_URL
    const socket = io(socketUrl, {
        auth: {
            serverOffset: 0,
            // gameId: null,
        },
    })

    socket.on("connection", () => {
        console.log("Connected to socket", socket.id)
    })

    socket.on("disconnect", () => {
        console.log("Disconnected from socket", socket.id)
    })

    socket.on("userJoin", ({ game }) => {
        console.log("USER JOINED")
        console.log(game)
        setGame(game)
    })

    socket.on("startGame", (game) => {
        setGame(game)
        // socket.auth.gameId = game.id
        console.log("start game")
        console.log(game)
    })

    socket.on("attackAttempt", (game) => {
        console.log("Attack attempt")
        // console.log(game)
        setGame(game)
    })

    return { socket, game }
}
