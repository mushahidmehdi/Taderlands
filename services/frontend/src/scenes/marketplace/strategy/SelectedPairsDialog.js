import { useTranslation } from "react-i18next";

import { Button, Grid } from "@mui/material";

import { Dialog } from "components";
import PairItem from "scenes/strategyBuilder/presets/PairItem";

export default function Pairs({ open, onClose, parities }) {
	const { t } = useTranslation("marketplace");

	return (
		<Dialog
			dialogProps={{
				open,
				onClose,
				fullWidth: true,
				maxWidth: "lg",
			}}
			title={t("marketplace_strategy_page_pairs_modal_title")}
			content={
				<Grid
					container
					direction="row"
					spacing={3}
					sx={{ width: "100%", overflow: "auto", maxHeight: "225px" }}
				>
					{parities.map((parity) => (
						<PairItem parity={parity} />
					))}
				</Grid>
			}
			action={
				<Button variant="outlined" onClick={onClose} sx={{ width: "200px" }}>
					{t("marketplace_strategy_page_pairs_close_button_text")}
				</Button>
			}
		/>
	);
}
