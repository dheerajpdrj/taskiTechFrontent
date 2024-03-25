import { createBrowserRouter } from "react-router-dom";
import Register from "./components/Registration";
import Details from "./components/Details";
import Error from "./error";

const appRouter = createBrowserRouter([
  {
    path: "/adduser",
    element: <Register />,
    errorElement:<Error/>
  },
  {
    path: "/",
    element: <Details />,
  },
  {
    path: "/adduser/:id",
    element: <Register />,
  },
]);

export default appRouter;
