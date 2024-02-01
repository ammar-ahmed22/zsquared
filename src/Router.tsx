import React from "react";
import { RouterProvider } from "react-router-dom";
import { createCustomBrowserRouter } from "./helpers/router";

// Pages
import Articles from "./pages/Articles";
import Post from "./pages/Post";
import Home from "./pages/Home";

const Router: React.FC = () => {
  const router = createCustomBrowserRouter([
    {
      path: "/",
      element: <Home />,
      navigationOption: "home",
      fullWidth: true,
    },
    {
      path: "/about",
      element: <div>Coming soon...</div>,
      navigationOption: "about",
    },
    {
      path: "/articles",
      element: <Articles />,
      navigationOption: "articles",
    },
    {
      path: "/articles/post/:slug",
      element: <Post />,
      navigationOption: "articles",
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Router;
