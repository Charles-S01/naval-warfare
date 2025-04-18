import { createContext, useState } from "react"
import reactLogo from "./assets/react.svg"
import viteLogo from "/vite.svg"
import "./App.css"
import useSocket from "./hooks/useSocket"
import { Outlet } from "react-router-dom"
import useWebSocket from "./hooks/useWebSocket"

export const AppContext = createContext({})

function App() {
    const {
        stompClient,
        game,
        retrieveGame,
        createGame,
        joinGame,
        placeShip,
        deleteGame,
        attack,
        canAttack,
    } = useWebSocket()

    return (
        <>
            <div className="m-0 box-border flex h-full w-full bg-blue-100 p-0">
                <AppContext.Provider
                    value={{
                        game,
                        stompClient,
                        retrieveGame,
                        createGame,
                        joinGame,
                        placeShip,
                        deleteGame,
                        attack,
                        canAttack,
                    }}
                >
                    <Outlet />
                </AppContext.Provider>
            </div>
        </>
    )
}

export default App
