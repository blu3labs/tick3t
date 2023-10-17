import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@/layouts";
import NotFound from "@/pages/notFound";
import Home from "@/pages/home";
import Event from "@/pages/event";
import CreateEvent from "@/pages/createEvent";
import BuyEvent from "@/pages/buyEvent";
import MyTickets from "@/pages/myTickets";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/event/:id",
        element: <Event />,
      },
      {
        path: "/event/:id/buy",
        element: <BuyEvent />,
      },
      {
        path: "/create-event",
        element: <CreateEvent />,
      },
      {
        path: "/my-tickets",
        element: <MyTickets />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default routes;
