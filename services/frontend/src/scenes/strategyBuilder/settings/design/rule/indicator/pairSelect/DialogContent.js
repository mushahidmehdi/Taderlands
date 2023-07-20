import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { Button, Grid, InputAdornment, List, ListItem, Typography } from "@mui/material";

import { TextField } from "components";
import Pair from "components/Pair";
import Platform from "components/Platform";

import { Search as SearchIcon } from "images";

import { PairSelectContext } from "./PairSelect";

const CustomListItem = ({ children, onClick, key }) => (
	<ListItem
		key={key}
		onClick={onClick}
		sx={{
			borderBottom: (theme) => `1px solid ${theme.palette.secondary.main}`,
			"&.MuiListItem-root": {
				paddingTop: 1,
				"&:hover": {
					backgroundColor: (theme) => theme.palette.info.main,
				},
			},
		}}
	>
		{children}
	</ListItem>
);

const DialogContent = ({ onClose, onChange }) => {
	const { parities } = useSelector((state) => state.parity);
	const { platforms } = useSelector((state) => state.platform);

	const { search, setSearch, pairs, setPairs, selectExchange, setSelectExchange, platform, setPlatform } =
		useContext(PairSelectContext);
	const { t } = useTranslation("workshop");

	useEffect(() => {
		if (search?.length === 0) {
			setPairs(
				platform
					? ["Runtime", ...parities.filter((x) => x.platformId === platform.id)]
					: ["Runtime", ...parities]
			);
		}

		if (search?.length >= 3) {
			setPairs([
				"Runtime",
				...parities.filter(
					(x) =>
						(platform ? x.platformId === platform.id : true) &&
						x.symbol.toLowerCase().includes(search.toLowerCase())
				),
			]);
		}
	}, [search]);

	const handlePlatformPick = (item) => {
		if (item === "All Platforms") {
			setSelectExchange(false);

			setPlatform();

			setPairs([
				"Runtime",
				...parities.filter((x) =>
					search?.length >= 3 ? x.symbol.toLowerCase().includes(search.toLowerCase()) : true
				),
			]);

			return;
		}

		setPlatform(item);

		setPairs([
			"Runtime",
			...parities.filter(
				(x) =>
					x.platformId === item.id &&
					(search?.length >= 3 ? x.symbol.toLowerCase().includes(search.toLowerCase()) : true)
			),
		]);

		setSelectExchange(false);
	};

	return (
		<Grid container>
			{!selectExchange && (
				<Grid item xs={12}>
					<TextField
						startAdornment={
							<InputAdornment position="start">
								<SearchIcon />
							</InputAdornment>
						}
						value={search}
						fullWidth
						onChange={(e) => setSearch(e.target.value)}
					/>
				</Grid>
			)}
			<Grid item xs={12}>
				<List>
					{!selectExchange && (
						<ListItem>
							<Grid container justifyContent="space-between">
								<Grid item></Grid>
								<Grid item>
									<Button variant="text" onClick={() => setSelectExchange(true)}>
										{platform?.name ? (
											<Platform platform={platform} />
										) : (
											<Typography>
												{t("workshop_tl_strategy_page_pair_select_exchange")}
											</Typography>
										)}
									</Button>
								</Grid>
							</Grid>
						</ListItem>
					)}
					{selectExchange &&
						[
							"All Platforms",
							...platforms.filter((x) => x.active && (x.info.strategyBuilding || x.info.pairSelection)),
						].map((item, ix) => (
							<CustomListItem onClick={() => handlePlatformPick(item)} key={ix}>
								{item === "All Platforms" ? (
									<Typography>{t("workshop_tl_strategy_page_pair_select_all_platforms")}</Typography>
								) : (
									<Platform platform={item} />
								)}
							</CustomListItem>
						))}

					{!selectExchange &&
						pairs &&
						pairs.map((item, ix) => (
							<CustomListItem
								key={ix}
								onClick={() => {
									setPlatform();

									onChange(item);

									onClose();
								}}
							>
								{item === "Runtime" ? (
									<Grid container item>
										<Typography sx={{ alignItems: "left", fontSize: "16px" }}>
											{t("strategy_builder_rule_design_pair_runtime")}
										</Typography>
									</Grid>
								) : (
									<Grid container>
										<Grid item xs={9}>
											<Pair base={item.base} quote={item.quote} />
										</Grid>
										<Grid item xs={3}>
											<Platform
												labelProps={{ sx: { pt: "2px" } }}
												platform={platforms.find((x) => x.id === item.platformId) ?? {}}
											/>
										</Grid>
									</Grid>
								)}
							</CustomListItem>
						))}
				</List>
			</Grid>
		</Grid>
	);
};

export default DialogContent;
