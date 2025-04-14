import { Client } from "@stomp/stompjs"
import axios from "axios"
import { useState } from "react"
import { v4 as uuidv4 } from "uuid"
import axiosInstance from "../axios/axiosInstance"

export default function useWebSocket(params) {
    const [game, setGame] = useState()
    const [gameId, setGameId] = useState(() => game?.id || localStorage.getItem("gameId"))

    console.log("game state:", game)

    const stompClient = new Client({
        brokerURL: import.meta.env.VITE_BROKER_URL,
        reconnectDelay: 5000,
        onConnect: () => {
            console.log("Stomp client connected")

            stompClient.subscribe(`/topic/public/room-${gameId}`, (res) => {
                const body = JSON.parse(res.body)
                console.log("event udpate:", body)
                handleEvent(body)
            })
        },
        onStompError: (frame) => {
            console.error("STOMP error:", frame.headers["message"])
            console.error("Details:", frame.body)
        },
    })

    stompClient.activate()

    function handleEvent(body) {
        const event = body.event
        if (event === "END") {
            localStorage.removeItem("gameId")
            setGame(null)
        } else {
            setGame(body.game)
        }
    }

    async function createGame() {
        try {
            const response = await axiosInstance.post(`/api/game`)
            console.log(response.data.game)
            setGame(response.data.game)
            setGameId(response.data.game.id)
            localStorage.setItem("gameId", response.data.game.id)
            localStorage.setItem("playerId", response.data.playerId)
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }

    async function joinGame(gameId) {
        const body = { gameId }
        try {
            setGameId(gameId)
            const response = await axiosInstance.post(`/api/game/join`, body)
            const playerId = response.data.playerId

            if (playerId) {
                localStorage.setItem("gameId", gameId)
                localStorage.setItem("playerId", playerId)
            }
            return playerId ? true : false
        } catch (error) {
            console.log(error)
            setGameId(null)
            return false
        }
    }

    async function placeShip({ gameId, playerId, coords }) {
        const body = { gameId, playerId, coords }
        try {
            const response = await axiosInstance.post(`/api/game/ships`, body)
            if (response.data.game) {
                setGame(response.data.game)
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function retrieveGame(gameId) {
        try {
            const response = await axiosInstance.get(`/api/game/${gameId}`)
            setGame(response.data.game)
            setGameId(response.data.game.id)
            return response.data.game
        } catch (error) {
            console.log(error)
        }
    }

    async function deleteGame(gameId) {
        try {
            const response = await axiosInstance.delete(`/api/game/${gameId}`)
        } catch (error) {
            console.log(error)
        }
    }

    return {
        stompClient,
        game,
        setGameIdHook: setGameId,
        retrieveGame,
        createGame,
        joinGame,
        placeShip,
        deleteGame,
    }
}
