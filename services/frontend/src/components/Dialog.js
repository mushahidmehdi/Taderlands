import React from "react";

import { Dialog as MuiDialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";

import { Close as CloseSvg } from "images";

export default function Dialog({ title, content, action, dialogProps, titleProps, contentProps, actionProps }) {
	return (
		<MuiDialog
			sx={{
				alignItems: "center",
				"& .MuiPaper-root": {
					padding: "16px",
				},
				...dialogProps?.sx,
			}}
			{...dialogProps}
		>
			<DialogTitle sx={{ alignSelf: "center", fontSize: 24, ...titleProps?.sx }} {...titleProps}>
				{title}
				<IconButton
					aria-label="close"
					onClick={dialogProps?.onClose}
					sx={{
						position: "absolute",
						right: 8,
						top: 8,
						color: (theme) => theme.palette.grey[500],
					}}
				>
					<CloseSvg />
				</IconButton>
			</DialogTitle>
			<DialogContent
				sx={{ display: "flex", flexDirection: "column", alignItems: "center", ...contentProps?.sx }}
				{...contentProps}
			>
				{content}
			</DialogContent>
			<DialogActions sx={{ justifyContent: "center", ...actionProps?.sx }} {...actionProps}>
				{action}
			</DialogActions>
		</MuiDialog>
	);
}
