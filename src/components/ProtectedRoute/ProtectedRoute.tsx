import { FC } from "react";
import { Navigate, Outlet } from "react-router-dom";

// STORES
import { useAuthStore } from "@/zustand/authStore";

interface IProtectedRouteProps {
	redirectingPath?: string;
}

const ProtectedRoute: FC<IProtectedRouteProps> = ({
	redirectingPath = "/signup",
}) => {
	const { auth } = useAuthStore();
	if (!auth) {
		return <Navigate to={redirectingPath} replace />;
	}
	return <Outlet />;
};

export default ProtectedRoute;
