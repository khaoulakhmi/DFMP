import React from "react"
import ReactDOM from "react-dom/client"
import { AppProviders } from "./app/providers/AppProviders"
import { RouterProvider } from "react-router-dom"
import { router } from "./app/router"


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  </React.StrictMode>
)