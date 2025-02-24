import { useState } from "react"
import { io } from "socket.io-client"

export default function useSocket(params) {
    const [gameId, setGameId] = useState()
    const [msg, setMsg] = useState()
    const [isFullGame, setIsFullGame] = useState(false)
    const [userGrid, setUserGrid] = useState([
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ])

    const socket = io("http://localhost:3000")

    socket.on("gameId", (gameId) => {
        setGameId(gameId)
    })

    socket.on("userJoin", ({ msg, isFullGame }) => {
        setMsg(msg)
        setIsFullGame(isFullGame)
    })

    const setId = (id) => {
        setGameId(id)
    }

    // socket.on('joinFail', (msg) => {

    // })
    return { socket, gameId, msg, setId, userGrid, isFullGame }
}
