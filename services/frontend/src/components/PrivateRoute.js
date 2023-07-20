import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute() {
	const { jwt: selectedJWT } = useSelector((state) => state.jwt);

	return selectedJWT ? <Outlet /> : <Navigate to="/login" />;
}
