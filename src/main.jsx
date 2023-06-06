import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from "react-router-dom"
import { RecoilRoot } from "recoil"
import { router } from "./routeConfig.jsx"
import './index.css'
import Root from './routes/Root.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RecoilRoot>
      <Root />
      {/* <RouterProvider router={router} /> */}
    </RecoilRoot>
  </React.StrictMode>,
)
