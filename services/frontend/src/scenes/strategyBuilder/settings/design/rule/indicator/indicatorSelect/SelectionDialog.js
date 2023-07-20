import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { Grid, InputAdornment, ListItem, Typography } from "@mui/material";

import { KEYS } from "scenes/strategyBuilder/settings/constants";
import { RuleDesignContext } from "scenes/strategyBuilder/settings/design/RuleDesign";
import { RuleGroupContext } from "scenes/strategyBuilder/settings/design/group/RuleGroup";
import { RuleContext } from "scenes/strategyBuilder/settings/design/rule/Rule";

import { Dialog, TextField } from "components";

import { changeRule } from "actions/StrategyBuilderActions";

import { Search as SearchIcon } from "images";

import { RuleIndicatorContext } from "../Indicator";

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

export default function SelectionDialog({ open, onClose }) {
	const { t, i18n } = useTranslation("workshop");

	const { indicators: indicatorsList } = useSelector((state) => state.indicator);
	const allIndicators = indicatorsList.filter((x) => x.isActive);

	const { groupIndex } = useContext(RuleGroupContext);
	const { index } = useContext(RuleContext);
	const { type } = useContext(RuleDesignContext);
	const { indicatorType } = useContext(RuleIndicatorContext);

	const [search, setSearch] = useState();
	const [indicators, setIndicators] = useState(allIndicators);

	const dispatch = useDispatch();

	const handleSelect = (item) => {
		dispatch(
			changeRule({
				type,
				groupIndex,
				index,
				key: indicatorType === "LEFT" ? KEYS.LEFT_PARAMS : KEYS.RIGHT_PARAMS,
				value: item.parameters.reduce(
					(acc, curr) => {
						acc[curr.name] = curr.def_value;
						return acc;
					},
					{
						applyTo: "Close",
					}
				),
			})
		);

		dispatch(
			changeRule({
				type,
				groupIndex,
				index,
				key: indicatorType === "LEFT" ? KEYS.LEFT_INDICATOR : KEYS.RIGHT_INDICATOR,
				value: item.name,
			})
		);

		onClose();
	};

	useEffect(() => {
		if (search?.length === 0) {
			setIndicators(allIndicators);
		}

		if (search?.length >= 3) {
			setIndicators(
				allIndicators.filter((x) =>
					x.translation?.[i18n.resolvedLanguage].toLowerCase().includes(search.toLowerCase())
				)
			);
		}
	}, [search]);

	return (
		<Dialog
			dialogProps={{
				open,
				onClose,
				maxWidth: "md",
				fullWidth: true,
				sx: {
					"&.MuiPaper-root": {
						maxHeight: "80vh",
						minHeight: "80vh",
					},
				},
			}}
			title={t("workshop_tl_strategy_page_indicator_select_placeholder")}
			content={
				<Grid container>
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
					<Grid item xs={12}>
						{indicators.map((indicator, ix) => (
							<CustomListItem
								key={ix}
								onClick={() => {
									handleSelect(indicator);
								}}
							>
								<Typography>{indicator?.translation?.[i18n.resolvedLanguage]}</Typography>
							</CustomListItem>
						))}
					</Grid>
				</Grid>
			}
		/>
	);
}
