import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, List } from "@mui/material";

import { setStrategy } from "actions/StrategyBuilderActions";

import PlatformItem from "./PlatformItem";

export default function PlatformDialog({ open, onClose }) {
	const { platforms } = useSelector((state) => state.platform);
	const { connections } = useSelector((state) => state.user);
	const { strategy } = useSelector((state) => state.strategyBuilder);

	const dispatch = useDispatch();

	const [chosenPlatform, setChosenPlatform] = useState(
		strategy?.platformId && platforms?.find((x) => x.id === strategy?.platformId)
	);

	const handleSave = () => {
		dispatch(
			setStrategy({
				...strategy,
				platformId: chosenPlatform.id,
				platformName: chosenPlatform.name,
				executionType: chosenPlatform?.info?.marketTypes?.find((x) => x === "SPOT") ? "SPOT" : null,
				parities: null,
			})
		);

		onClose();
	};
	const { t } = useTranslation("workshop");

	return (
		<>
			{platforms ? (
				<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
					<DialogTitle>{t("workshop_presets_choose_exchange_title")}</DialogTitle>
					<DialogContent>
						<List>
							{platforms &&
								platforms
									.filter((x) => x.active && x.info.strategyBuilding)
									.map((platform, ix) => (
										<PlatformItem
											key={ix}
											platform={platform}
											checked={chosenPlatform?.id === platform.id}
											strategy={strategy}
											onChange={() => setChosenPlatform(platform)}
										/>
									))}
						</List>
					</DialogContent>
					<DialogActions>
						<Button variant="contained" fullWidth onClick={handleSave}>
							{t("workshop_menu_item_6")}
						</Button>
					</DialogActions>
				</Dialog>
			) : (
				<CircularProgress />
			)}
		</>
	);
}
