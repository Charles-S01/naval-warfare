import { createContext, useState } from "react"
import reactLogo from "./assets/react.svg"
import viteLogo from "/vite.svg"
import "./App.css"
import useSocket from "./hooks/useSocket"
import { Outlet } from "react-router-dom"

export const AppContext = createContext({})

function App() {
    const { socket, game, retrieveGame, setGame } = useSocket()

    return (
        <>
            <div className="m-0 box-border flex h-full w-full bg-blue-100 p-0">
                <AppContext.Provider value={{ socket, game, retrieveGame, setGame }}>
                    <Outlet />
                </AppContext.Provider>
            </div>
        </>
    )
}

export default App
