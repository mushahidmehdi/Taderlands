import { useState } from "react";
import { useTranslation } from "react-i18next";

import {
	Button,
	Checkbox,
	Dialog,
	DialogContent,
	DialogTitle,
	FormControl,
	FormControlLabel,
	FormGroup,
	FormLabel,
	Grid,
	IconButton,
	Typography,
} from "@mui/material";

import useQuery from "utils/useQuery";

import { Close as CloseSvg } from "images";

export default function FilterDialog({ open, onClose, onSave }) {
	const query = useQuery();
	const [selected, setSelected] = useState({
		transactionDatelt: new Date(Date.now()).toUTCString(),
		...(query.get("source") && { source: query.get("source") }),
	});
	const [selectedDate, setSelectedDate] = useState();

	const { t, i18n } = useTranslation();

	const date = new Date(Date.now());

	return (
		<Dialog
			open={open}
			onClose={onClose}
			sx={{
				"& .MuiPaper-root": {
					margin: "0 0 0 auto",
					height: "100%",
					maxHeight: "none",
					maxWidth: "400px",
				},
			}}
		>
			<DialogTitle sx={{ fontSize: 24 }}>
				<IconButton
					aria-label="close"
					onClick={onClose}
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
			<DialogContent sx={{ paddingTop: "10vh !important" }}>
				<Grid container spacing={2} direction="column" alignItems="center" justifyContent="center">
					<Grid item xs={12}>
						<Typography variant="h5">{t(`controlPanel.positions.filter.Filters`)}</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="p">{t(`controlPanel.positions.filter.Filters Explanation`)}</Typography>
					</Grid>
				</Grid>
				<Grid sx={{ paddingTop: "3vh" }}>
					<FormControl>
						<FormLabel id="demo-row-radio-buttons-group-label">{t(`By Date`)}</FormLabel>
						<FormGroup row>
							<FormControlLabel
								key={"week"}
								control={
									<Checkbox
										name={"1 Hafta"}
										onChange={(e) => {
											setSelected({
												...selected,
												transactionDateGte: new Date(
													date.setDate(date.getDate() - 7)
												).toISOString(),
											});
											setSelectedDate(i18n.resolvedLanguage === "tr" ? "Son Hafta" : "Last Week");
										}}
										checked={
											selectedDate ===
											(i18n.resolvedLanguage === "tr" ? "Son Hafta" : "Last Week")
										}
									/>
								}
								label={i18n.resolvedLanguage === "tr" ? "1 Hafta" : "1 Week"}
							/>
							<FormControlLabel
								key={"month"}
								control={
									<Checkbox
										name={"1 Ay"}
										onChange={(e) => {
											setSelected({
												...selected,
												transactionDateGte: new Date(
													date.setMonth(date.getMonth() - 1)
												).toISOString(),
											});
											setSelectedDate(i18n.resolvedLanguage === "tr" ? "Son Ay" : "Last Month");
										}}
										checked={
											selectedDate === (i18n.resolvedLanguage === "tr" ? "Son Ay" : "Last Month")
										}
									/>
								}
								label={i18n.resolvedLanguage === "tr" ? "1 Ay" : "1 Month"}
							/>
							<FormControlLabel
								key={"3month"}
								control={
									<Checkbox
										name={"1 Ay"}
										onChange={(e) => {
											setSelected({
												...selected,
												transactionDateGte: new Date(
													date.setMonth(date.getMonth() - 3)
												).toISOString(),
											});
											setSelectedDate(
												i18n.resolvedLanguage === "tr" ? "Son 3 Ay" : "Last 3 Months"
											);
										}}
										checked={
											selectedDate ===
											(i18n.resolvedLanguage === "tr" ? "Son 3 Ay" : "Last 3 Months")
										}
									/>
								}
								label={i18n.resolvedLanguage === "tr" ? "3 Ay" : "3 Months"}
							/>
						</FormGroup>
					</FormControl>
				</Grid>
				<Grid container spacing={2} sx={{ paddingTop: "3vh" }}>
					<Grid item xs={12}>
						<Button
							fullWidth
							variant="outlined"
							onClick={() => {
								setSelected();
							}}
						>
							{t(`controlPanel.positions.filter.Clear Filter`)}
						</Button>
					</Grid>
					<Grid item xs={12}>
						<Button
							fullWidth
							variant="contained"
							onClick={() => {
								onSave(selected, selectedDate);
							}}
						>
							{t(`controlPanel.positions.filter.Save`)}
						</Button>
					</Grid>
				</Grid>
			</DialogContent>
		</Dialog>
	);
}
