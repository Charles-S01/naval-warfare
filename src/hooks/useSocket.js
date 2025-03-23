import { useState } from "react"
import { io } from "socket.io-client"

export default function useSocket(params) {
    const [game, setGame] = useState()

    const socketUrl = import.meta.env.VITE_SOCKET_URL
    const socket = io(socketUrl)

    socket.on("connection", () => {
        console.log("Connected to socket", socket.id)
    })

    socket.on("disconnect", () => {
        console.log("Disconnected from socket", socket.id)
    })

    socket.on("userJoin", (game) => {
        console.log("USER JOINED")
        // console.log(game)
        setGame(game)
    })

    socket.on("startGame", (game) => {
        setGame(game)
        console.log("start game")
        // console.log(game)
    })

    socket.on("attackAttempt", (game) => {
        console.log("Attack attempt")
        // console.log(game)
        setGame(game)
    })

    async function retrieveGame(gameId) {
        try {
            const response = await socket.emitWithAck("retrieve-game", gameId)
            // console.log("retrieved game:", game)
            setGame(response.game)
            return response.game
        } catch (error) {
            console.log(error)
        }
    }

    return { socket, game, retrieveGame, setGame }
}
