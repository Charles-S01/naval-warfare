import { Link } from "react-router-dom"

export default function Error(params) {
    return (
        <>
            <div className="flex h-full w-full items-center justify-center bg-blue-100">
                <div className="error-box flex flex-col gap-2 p-4">
                    <p>Something went wrong...</p>
                    <p>Try refreshing the page</p>
                    <p>or</p>
                    <p className="text-blue-600 underline">
                        <Link to={"/"}>Go to home page</Link>
                    </p>
                </div>
            </div>
        </>
    )
}
