import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { Close as CloseIcon } from "@mui/icons-material";
import {
	Autocomplete,
	Button,
	Checkbox,
	Chip,
	Dialog,
	DialogContent,
	DialogTitle,
	FormControl,
	FormControlLabel,
	FormGroup,
	FormLabel,
	Grid,
	IconButton,
	Switch,
	TextField,
	Typography,
} from "@mui/material";

import { uniqBy } from "lodash";

import { ArrowDown, Close as CloseSvg } from "images";

export default function FilterDialog({ filterData, data, open, onClose, onSave }) {
	const { parities } = useSelector((state) => state.parity);

	const [selected, setSelected] = useState({
		...data,
		...(data?.symbols
			? {
					parities: parities
						.filter(
							(x) =>
								data.symbols.some((y) => x.symbol === y) &&
								data?.platforms?.some((y) => y.id === x.platformId)
						)
						.map((x) => ({ id: x.id, platformId: x.platformId, name: x.symbol, quote: x.quote })),
			  }
			: {}),
	});

	const { t } = useTranslation();

	const dropdownFields = [
		{
			label: t("control_panel_positions_filter_platform_title"),
			key: "platforms",
			data: filterData?.platforms,
		},
		{
			label: t("control_panel_positions_filter_strategy_title"),
			key: "strategies",
			data: filterData?.strategies
				?.filter((x) => selected?.platforms?.some((y) => y.id === x.platformId))
				.map((x) => ({ id: x.id, name: x.marketStrategyName ?? x.name })),
		},
		{
			label: t("control_panel_positions_filter_choose_pair_title"),
			key: "parities",
			data: parities
				?.map((x) => ({ id: x.id, platformId: x.platformId, name: x.symbol, quote: x.quote }))
				?.filter(
					(x) =>
						selected?.platforms?.some((y) => y.id === x.platformId) &&
						(selected?.quotes?.length ? selected?.quotes?.some((z) => z === x.quote) : true)
				),
		},
	];

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
						<Typography variant="h5">{t(`control_panel_positions_filter_main_title`)}</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="p">{t(`control_panel_positions_filter_main_text`)}</Typography>
					</Grid>
				</Grid>

				<Grid sx={{ paddingTop: "3vh" }}>
					{dropdownFields.map(({ key, label, data }) => {
						return (
							<div style={{ marginBottom: "8px" }}>
								<Typography color={(theme) => theme.palette.primary.main}>{label}</Typography>
								<Autocomplete
									key={key}
									multiple
									sx={{
										"& .MuiFormControl-root": {
											marginTop: "8px",
										},
									}}
									id="combo-box-demo"
									options={data}
									value={selected?.[key] ?? []}
									onChange={(_, newValue) => {
										setSelected({
											...selected,
											[key]:
												newValue?.length === 0
													? []
													: uniqBy([...(selected?.[key] ?? []), ...newValue], "id"),
										});
									}}
									clearOnBlur={false}
									renderTags={(values, getTagProps) => {
										return values.map((option, index) => (
											<Chip
												sx={{ borderRadius: 1, backgroundColor: "#6A1FC2", color: "white" }}
												{...getTagProps({ index })}
												deleteIcon={
													<CloseIcon
														sx={{
															color: "white !important",
															fontSize: "16px !important",
															border: "none",
															marginLeft: "-8px !important",
														}}
													/>
												}
												onDelete={() => {
													setSelected({
														...selected,
														[key]: selected?.[key].filter((x) => x.id !== option.id),
													});
												}}
												label={option.name}
											/>
										));
									}}
									popupIcon={<ArrowDown />}
									getOptionLabel={(option) => option.name}
									renderInput={(params) => (
										<TextField
											sx={{
												"& fieldset": {
													borderRadius: "8px",
													borderColor: (theme) => theme.palette.primary.main,
												},
												"& .MuiOutlinedInput-root": {},
											}}
											{...params}
											margin="normal"
											fullWidth
										/>
									)}
								/>
							</div>
						);
					})}

					<FormGroup>
						<FormControlLabel
							checked={selected?.includeVirtual !== "false" ? true : false}
							control={<Switch />}
							label={t(`control_panel_positions_filter_include_virtuals`)}
							onChange={(e) => {
								setSelected({ ...selected, includeVirtual: e.target.checked ? "true" : "false" });
							}}
						/>
					</FormGroup>
					<FormControl>
						<FormLabel id="demo-row-radio-buttons-group-label">
							{t(`control_panel_positions_filter_base_pair_title`)}
						</FormLabel>
						<FormGroup row>
							{["BTC", "USDT", "USD", "TRY"].map((quote) => (
								<FormControlLabel
									key={quote}
									control={
										<Checkbox
											name={quote}
											onChange={(e) => {
												setSelected({
													...selected,
													quotes: e.target.checked
														? [...(selected?.quotes ?? []), e.target.name]
														: selected?.quotes.filter((x) => x !== e.target.name),
												});
											}}
											checked={selected?.quotes?.includes(quote)}
										/>
									}
									label={quote}
								/>
							))}
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
							{t(`control_panel_positions_filter_reset_button`)}
						</Button>
					</Grid>
					<Grid item xs={12}>
						<Button
							fullWidth
							variant="contained"
							onClick={() => {
								onSave(selected);
							}}
						>
							{t(`control_panel_positions_filter_save_button`)}
						</Button>
					</Grid>
				</Grid>
			</DialogContent>
		</Dialog>
	);
}
