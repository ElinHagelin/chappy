import { createBrowserRouter } from "react-router-dom"
import Root from "../src/routes/Root.jsx"


export const router = createBrowserRouter([
	{
		path: "/",
		element: <Root />,

	},
])