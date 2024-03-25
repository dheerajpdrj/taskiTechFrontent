import React from "react";
import { RouterProvider } from "react-router";
import "./App.css";
import appRouter from "./routes";

function App() {
  return (
    <RouterProvider router={appRouter}>
      <div className="App">
      </div>
    </RouterProvider>
  );
}

export default App;
