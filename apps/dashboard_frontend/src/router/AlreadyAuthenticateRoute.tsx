import type { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
interface PrivateRouteProps {
  children: ReactElement;
}

function AlreadyAuthenticateRoute({ children }: PrivateRouteProps) {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
}

export default AlreadyAuthenticateRoute;
