import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup } from "@mui/material";

import { setStrategy } from "actions/StrategyBuilderActions";
import { Chip, SmallText } from "components";
import { ExecutionTypeLong, ExecutionTypeShort } from "images";

export default function ChooseExecutionType() {
	const { strategy } = useSelector((state) => state.strategyBuilder);
	const { t } = useTranslation("workshop");

	const dispatch = useDispatch();

	return (
		<Grid container>
			<Grid item xs={12}>
				<FormControl disabled={strategy?.public || strategy?.openPositionsCount}>
					<FormLabel sx={{ color: (theme) => theme.palette.primary.main }}>
						{t("workshop_presets_choose_execution_side_title")}
					</FormLabel>
					<RadioGroup
						row
						aria-labelledby="demo-row-radio-buttons-group-label"
						name="row-radio-buttons-group"
						sx={{ paddingLeft: 0.5, marginTop: 1 }}
						value={strategy?.executionType}
						onChange={(_, value) => {
							dispatch(setStrategy({ ...strategy, executionType: value }));
						}}
					>
						<FormControlLabel
							value="LONG"
							control={<Radio sx={{ padding: 0.5 }} />}
							label={
								<Chip
									backgroundColor="#0F20E8"
									label="Long"
									fontSize="12px"
									key="long"
									icon={ExecutionTypeLong}
								/>
							}
						/>
						<FormControlLabel
							value="SHORT"
							control={<Radio sx={{ padding: 0.5 }} />}
							label={
								<Chip
									backgroundColor="#6F79F1"
									label="Short"
									fontSize="12px"
									key="short"
									icon={ExecutionTypeShort}
								/>
							}
						/>
					</RadioGroup>
					{strategy?.public ? (
						<SmallText>
							{t(
								"error.You can not change exchange or execution types for a strategy published on the Marketplace"
							)}
						</SmallText>
					) : (
						<></>
					)}
					{strategy?.openPositionsCount ? (
						<SmallText>
							{t(
								"error.You can not change the exchange or execution type fields for a strategy with open positions"
							)}
						</SmallText>
					) : (
						<></>
					)}
				</FormControl>
			</Grid>
		</Grid>
	);
}
