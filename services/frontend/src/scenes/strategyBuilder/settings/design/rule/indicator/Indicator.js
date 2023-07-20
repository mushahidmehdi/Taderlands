import React, { createContext, useRef } from "react";

import { Grid } from "@mui/material";

import { IndexSelect } from "./indexSelect";
import { IndicatorSelect } from "./indicatorSelect";
import { IntervalSelect } from "./intervalSelect";
import { PairSelect } from "./pairSelect";

export const RuleIndicatorContext = createContext();

export default function Indicator({ type: indicatorType }) {
	const ref = useRef(null);

	return (
		<RuleIndicatorContext.Provider value={{ indicatorType }}>
			<Grid item xs={5.3}>
				<div {...(indicatorType === "LEFT" && { ref })}>
					<Grid container sx={{ ml: 2, mt: "4px", pr: 2 }} rowSpacing={1}>
						<Grid item xs={12}>
							<Grid container spacing={1}>
								<Grid item xs={0.644 * 12}>
									<PairSelect />
								</Grid>
								<Grid item xs={0.308 * 12}>
									<IntervalSelect />
								</Grid>
							</Grid>
						</Grid>
						<Grid item xs={12}>
							<Grid container spacing={1}>
								<Grid item xs={0.644 * 12}>
									<IndicatorSelect />
								</Grid>
								<Grid item xs={0.308 * 12}>
									<IndexSelect />
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</div>
			</Grid>
		</RuleIndicatorContext.Provider>
	);
}
