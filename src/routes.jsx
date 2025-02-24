import App from "./App"
import Game from "./pages/Game"
import Home from "./pages/Home"

const routes = [
    {
        path: "/",
        element: <App />,
        children: [
            { index: true, element: <Home /> },
            { path: "/game", element: <Game /> },
        ],
    },
]

export default routes
