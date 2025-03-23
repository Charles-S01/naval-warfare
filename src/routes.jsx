import App from "./App"
import Error from "./pages/Error"
import Game from "./pages/Game"
import Home from "./pages/Home"

const routes = [
    {
        path: "/",
        element: <App />,
        errorElement: <Error />,
        children: [
            { index: true, element: <Home /> },
            { path: "/game", element: <Game /> },
        ],
    },
]

export default routes
