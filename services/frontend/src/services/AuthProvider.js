import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import jwtDecode from "jwt-decode";

import { AuthContext, FetchError } from "./AuthContext";

export default function AuthProvider({ children }) {
	const [user, setUser] = useState();
	const { jwt: selectedJWT } = useSelector((state) => state.jwt);

	const dispatch = useDispatch();

	const fetchAuthorized = async (url, opt = {}) => {
		if (!selectedJWT) {
			throw new FetchError("Not authenticated");
		}

		opt.headers = {
			"Content-type": "application/json",
			Authorization: `Bearer ${selectedJWT.accessToken}`,
			...opt.headers,
		};

		return fetch(url, opt);
	};

	useEffect(() => {
		if (selectedJWT?.accessToken) {
			setUser(jwtDecode(selectedJWT?.accessToken));
		}

		// this checks each tab continuously
		const checkTokenValid = setInterval(() => {
			const parsedParaticaKey = JSON.parse(localStorage.getItem("persist:paratica:paratica-web") ?? "{}");

			const { jwt } = JSON.parse(parsedParaticaKey.jwt ?? "{}");

			if (
				[
					"register",
					"login",
					"login-verification",
					"register-verification",
					"register-success",
					"forgot-password",
				].includes(window.location.pathname.replace("/", ""))
			) {
				if (jwt) {
					window.location.replace("/dashboard");
				}

				return;
			}

			if (!jwt) {
				localStorage.clear();

				window.location.replace("/login");
			}
		}, 500);

		return () => clearInterval(checkTokenValid);
	}, [selectedJWT]);

	return (
		<AuthContext.Provider
			value={{
				fetchAuthorized,
				user,
				setUser,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}
