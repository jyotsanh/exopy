import { Role } from "@/const/enum";
import { useAppSelector } from "@/store/hook/hook";
import { Navigate } from "react-router-dom";

interface RoleRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
  excludedRoles?: Role[];
  redirectTo?: string;
}

function RoleRoute({
  children,
  allowedRoles,
  excludedRoles,
  redirectTo = "/dashboard",
}: RoleRouteProps) {
  const { user } = useAppSelector((state) => state.auth);

  if (allowedRoles && !allowedRoles.includes(user?.role as Role)) {
    return <Navigate to={redirectTo} replace />;
  }

  if (excludedRoles && excludedRoles.includes(user?.role as Role)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}

export default RoleRoute;
