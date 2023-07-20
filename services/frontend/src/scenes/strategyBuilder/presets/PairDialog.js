import { createContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { useSnackbar } from "notistack";

import {
	Button,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid,
	InputAdornment,
	Tab,
	Tabs,
} from "@mui/material";

import { setStrategy } from "actions/StrategyBuilderActions";
import { TextField } from "components";
import { Scroll, ScrollUp, Search } from "images";

import PairItem from "./PairItem";

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		"aria-controls": `simple-tabpanel-${index}`,
	};
}

export const PairContext = createContext();

export default function PairDialog({ open, onClose, onSave }) {
	const { strategy } = useSelector((state) => state.strategyBuilder);
	const { parities } = useSelector((state) => state.parity);
	const { t } = useTranslation("workshop");

	const paritiesByQuote = parities
		.filter((x) => x.platformId === strategy.platformId)
		.reduce(
			(acc, curr) => ({
				...acc,
				[curr.quote]: [...(acc[curr.quote] || []), curr],
			}),
			{}
		);

	const dispatch = useDispatch();

	const [tab, setTab] = useState(0);
	const [currentParities, setCurrentParities] = useState(paritiesByQuote[Object.keys(paritiesByQuote)[0]]);
	const [selectedParities, setSelectedParities] = useState(
		parities.filter((y) => strategy?.parities?.symbols?.some((x) => x === y.id))
	);
	const [search, setSearch] = useState();
	const [show, setShow] = useState({
		selectedParities: true,
		pairList: true,
	});

	const { enqueueSnackbar } = useSnackbar();

	const handleTabChange = (tabValue) => {
		setTab(tabValue);
		setCurrentParities(paritiesByQuote[Object.keys(paritiesByQuote)[tabValue]]);
	};

	const handlePairClick = (parity) => {
		if (!selectedParities?.find((x) => x.id === parity.id) && selectedParities.length === 50) {
			enqueueSnackbar("You can not select more than 50 parities.", { variant: "error" });

			return;
		}

		const pairs = selectedParities.some((x) => x.id === parity.id)
			? selectedParities.filter((x) => x.id !== parity.id)
			: [...(selectedParities ?? []), parity];

		setSelectedParities(pairs);
	};

	const handleSave = () => {
		dispatch(
			setStrategy({
				...strategy,
				parities: {
					quotes: [
						...selectedParities?.reduce((acc, curr) => {
							acc.add(curr.quote);

							return acc;
						}, new Set()),
					],
					symbols: selectedParities?.map((x) => x.id),
				},
			})
		);

		onClose();
	};

	return (
		<>
			{parities ? (
				<Dialog
					open={open}
					onClose={onClose}
					maxWidth="lg"
					fullWidth
					sx={{
						"& .MuiDialog-paper": {
							maxHeight: "90vh",
							minHeight: "90vh",
						},
					}}
				>
					<DialogTitle sx={{ textAlign: "center", fontSize: "24px", fontWeight: 700 }}>
						{t("workshop_presets_select_pair_dialog_main_title")}
					</DialogTitle>
					<DialogContent>
						<Tabs
							centered
							fullWidth
							value={tab}
							onChange={(_, newValue) => {
								handleTabChange(newValue);
							}}
						>
							{Object.keys(paritiesByQuote).map((quote, ix) => (
								<Tab key={quote} label={quote} {...a11yProps(ix)} />
							))}
						</Tabs>
						<Grid container spacing={3} sx={{ marginTop: "16px" }}>
							<Grid item xs={12}>
								<Grid container justifyContent="space-between">
									<Grid item>
										<TextField
											sx={{ minWidth: "250px" }}
											placeholder={t("workshop_presets_select_pair_dialog_search_bar")}
											margin="dense"
											InputProps={{
												startAdornment: (
													<InputAdornment position="start">
														<Search />
													</InputAdornment>
												),
											}}
											onChange={(e) => setSearch(e.target.value)}
										/>
									</Grid>

									<Grid item sx={{ paddingTop: "16px" }}>
										<Button
											variant="text"
											onClick={() => {
												dispatch(setStrategy({ ...strategy, parities: null }));
												setSelectedParities([]);
											}}
										>
											{t("workshop_presets_select_pair_dialog_deselect_button_text")}
										</Button>
									</Grid>
								</Grid>
							</Grid>

							<Grid item xs={12}>
								<Button
									onClick={() => {
										setShow({
											...show,
											selectedParities: !show?.selectedParities,
										});
									}}
									variant="text"
									startIcon={show?.selectedParities ? <Scroll /> : <ScrollUp />}
								>
									{t("workshop_presets_select_pair_dialog_selected_pairs_title")}{" "}
									{`${selectedParities.length}/50`}
								</Button>
							</Grid>

							{show?.selectedParities && selectedParities?.length !== 0 && (
								<Grid item xs={12}>
									<Grid
										container
										direction="row"
										spacing={3}
										sx={{ width: "100%", overflow: "auto", maxHeight: "225px" }}
									>
										{selectedParities.map((parity) => (
											<PairItem parity={parity} />
										))}
									</Grid>
								</Grid>
							)}

							<Grid item xs={12}>
								<Button
									onClick={() => {
										setShow({
											...show,
											pairList: !show?.pairList,
										});
									}}
									variant="text"
									startIcon={show?.pairList ? <Scroll /> : <ScrollUp />}
								>
									{t("workshop_presets_select_pair_dialog_pairs_list_title")}
								</Button>
							</Grid>
							{show.pairList &&
								currentParities &&
								currentParities.map((parity) => {
									if (search && !parity.base.toLowerCase().startsWith(search.toLowerCase())) {
										return;
									}

									return (
										<PairItem
											onClick={handlePairClick}
											parity={parity}
											selected={selectedParities.some((x) => x.id === parity.id)}
										/>
									);
								})}
						</Grid>
					</DialogContent>
					<DialogActions>
						<Grid container justifyContent="center">
							<Grid item>
								<Button variant="contained" sx={{ minWidth: "200px" }} onClick={handleSave}>
									{t("workshop_presets_select_pair_dialog_save_button")}
								</Button>
							</Grid>
						</Grid>
					</DialogActions>
				</Dialog>
			) : (
				<CircularProgress />
			)}
		</>
	);
}
