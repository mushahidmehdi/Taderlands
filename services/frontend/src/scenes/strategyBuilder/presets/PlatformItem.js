import React from "react";

import { Avatar, ListItem, ListItemAvatar, ListItemButton, ListItemText, Radio, Typography } from "@mui/material";

import { Chip } from "components";
import Config from "services/config";

export default function PlatformItem({ platform, strategy, checked, onChange }) {
	return (
		<ListItem
			key={platform?.id}
			sx={{
				marginBottom: 2,
				borderRadius: 2,
				border: strategy?.platformId === platform?.id ? "1px solid #0F20E8" : "1px solid #CFD2FA",
			}}
			secondaryAction={onChange ? <Radio onChange={onChange} checked={checked} /> : <></>}
			disablePadding
		>
			<ListItemButton sx={{ padding: 2 }} onClick={onChange}>
				<ListItemAvatar>
					<Avatar
						alt={platform.exchange}
						variant="square"
						sx={{ width: "60px", height: "60px" }}
						src={`${Config.cdnRoot()}/general/exchange-icons/${platform.exchange}.png`}
					/>
				</ListItemAvatar>
				<ListItemText
					id={platform.id + "label"}
					sx={{
						marginLeft: 2,
						"& .MuiListItemText-secondary": {
							marginTop: 1,
						},
					}}
					primary={
						<Typography sx={{ color: "#0F20E8", fontSize: "16px", fontWeight: 700 }}>
							{platform.name}
						</Typography>
					}
					secondary={
						<>
							{platform.info.marketTypes.map((type) => (
								<Chip key={type} backgroundColor="#6A1FC2" label={type} fontSize="12px" />
							))}
						</>
					}
				/>
			</ListItemButton>
		</ListItem>
	);
}
