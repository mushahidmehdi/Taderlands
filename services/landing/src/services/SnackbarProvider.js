import React, { useRef } from "react";

import { SnackbarProvider as NotistackProvider } from "notistack";

import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";

export default function SnackbarProvider({ children }) {
	const notistackRef = useRef();

	return (
		<NotistackProvider
			anchorOrigin={{
				vertical: "bottom",
				horizontal: "center",
			}}
			maxSnack={2}
			preventDuplicate
			ref={notistackRef}
			action={(key) => (
				<IconButton color="inherit" size="small" onClick={() => notistackRef.current.closeSnackbar(key)}>
					<Close />
				</IconButton>
			)}
			onClose={(event, reason, key) => {
				if (reason === "clickaway") {
					notistackRef.current.closeSnackbar(key);
				}
			}}
		>
			{children}
		</NotistackProvider>
	);
}
