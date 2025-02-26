import { createContext, useState } from "react"
import reactLogo from "./assets/react.svg"
import viteLogo from "/vite.svg"
import "./App.css"
import useSocket from "./hooks/useSocket"
import { Outlet } from "react-router-dom"

export const AppContext = createContext({})

function App() {
    const { socket, userGrid, game } = useSocket()

    return (
        <>
            <div className="m-0 flex h-full w-full bg-blue-100 p-0">
                <AppContext.Provider value={{ socket, userGrid, game }}>
                    <Outlet />
                </AppContext.Provider>
            </div>
        </>
    )
}

export default App
