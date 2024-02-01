import {
  createBrowserRouter,
  RouteObject,
} from "react-router-dom";
import Page, { PageProps } from "../components/Page";

type CustomRouteObject = RouteObject &
  Omit<PageProps, "children">;

type CreateBrowserRouterOpts = Parameters<
  typeof createBrowserRouter
>[1];

export const createCustomBrowserRouter = (
  routes: CustomRouteObject[],
  opts?: CreateBrowserRouterOpts,
) => {
  const customRoutes: RouteObject[] = routes.map(
    (route) => {
      const {
        element,
        navigationOption,
        fullWidth,
        ...rest
      } = route;
      return {
        ...rest,
        element: (
          <Page
            navigationOption={navigationOption}
            fullWidth={fullWidth}
          >
            {element}
          </Page>
        ),
      };
    },
  );
  return createBrowserRouter(customRoutes, opts);
};
