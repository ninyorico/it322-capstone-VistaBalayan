import { createBrowserRouter } from "react-router";
import Login from "./pages/Login";
//import TourismHome from "./pages/public/TourismHome";


export const router = createBrowserRouter([
  // Public Routes (No login required)
 /* {
    path: "/",
    Component: TourismHome,  // Public tourism website - home page
  },
{
    path: "/explore",
    Component: TourismHome,  // Alias for the tourism page
  },
*/
  // Admin Login
  {
    path: "/admin/login",
    Component: Login,
  },

  // Officer Routes (Admin System)
  {
    path: "/officer",
  },

  // Staff Routes (Admin System)
  {
    path: "/staff",
  },

  // 404 - Not Found
]);