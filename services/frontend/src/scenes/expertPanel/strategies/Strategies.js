import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Box, Button, Grid, Paper, Typography } from "@mui/material";

import { Chip } from "components";

import { ExecutionTypeLong, ExecutionTypeShort, Settings as SettingsSvg } from "images";

import { MaintenanceDialog } from "../maintenance";
import { CriteriaDialog } from "../publishStrategy";
import { Info, PublishState } from "./columns";

export default function Strategies({ strategies, handleRefreshStategies }) {
	const [open, setOpen] = useState(false);
	const [maintenanceOpen, setMeintenanceOpen] = useState(false);
	const [selectedStrategy, setSelectedStrategy] = useState(null);
	const [strategyStatus, setStrategyStatus] = useState(null);
	const { t } = useTranslation("expertPanel");

	return (
		<Box>
			{strategies.map((strategy) => {
				return (
					<Paper
						variant="outlined"
						elevation={0}
						sx={{
							mt: 2,
							paddingBlock: 2,
							backgroundColor: "#FFFFFF",
							borderColor: "#CFD2FA",
							overflow: "hidden",
						}}
					>
						<Grid container justifyContent={"space-between"} alignItems={"center"} xs={12}>
							<Grid item xs={3}>
								<Info virtual name={strategy.name} quotes={strategy.parities.quotes} hideIcon={true} />
							</Grid>

							<Grid item xs={2}>
								<Typography
									sx={{
										fontSize: "14px",
										fontWeight: 400,
										lineHeight: "18px",
										color: "#3A3A3A",
									}}
								>
									{strategy.platform.exchange.charAt(0).toUpperCase() +
										strategy.platform.exchange.slice(1)}
								</Typography>
							</Grid>

							<Grid item xs={2}>
								<Chip
									backgroundColor="blue"
									width="6rem"
									label={strategy.executionType}
									fontSize="12px"
									icon={strategy.executionType === "LONG" ? ExecutionTypeLong : ExecutionTypeShort}
									sx={{
										width: "5.5rem",
										borderRadius: "0.2rem",
									}}
								/>
							</Grid>
							<Grid item xs={1.5}>
								<PublishState
									isPublished={strategy.public === 0 ? false : true}
									isMaintenance={strategy?.marketStrategy?.status === "MAINTENANCE"}
								/>
							</Grid>

							<Grid item xs={3} textAlign="center">
								{strategy.public === 1 ? (
									<Button
										variant="text"
										onClick={() => {
											setSelectedStrategy(strategy);
											setMeintenanceOpen(true);
										}}
									>
										<SettingsSvg width={24} height={24} />
									</Button>
								) : strategy.strategySuccesses.length > 0 &&
								  strategy.strategySuccesses[0].status?.result === "PENDING" ? (
									<Typography
										color="primary"
										sx={{
											wordWrap: "break-word",
											fontSize: "14px",
										}}
									>
										{t("expert_panel_stragies_table_pending_button_text")}
									</Typography>
								) : strategy.strategySuccesses.length === 0 ? (
									<Button
										sx={{
											fontSize: "14px",
											fontWeight: 700,
											lineHeight: "16px",
										}}
										variant="text"
										onClick={() => {
											setSelectedStrategy(strategy);
											setOpen(true);
											setStrategyStatus("Publish");
										}}
									>
										{t("expert_panel_stragies_table_share_button_text")}
									</Button>
								) : (
									strategy.strategySuccesses.length > 0 && (
										<Button
											sx={{
												fontSize: "14px",
												fontWeight: 700,
												lineHeight: "16px",
											}}
											variant="text"
											onClick={() => {
												setSelectedStrategy(strategy);
												setOpen(true);
												setStrategyStatus("ViewResult");
											}}
										>
											{t("expert_panel_stragies_table_view_result_button_text")}
										</Button>
									)
								)}
							</Grid>
						</Grid>
					</Paper>
				);
			})}
			{open && (
				<CriteriaDialog
					open={open}
					selectedStrategy={selectedStrategy}
					strategyStatus={strategyStatus}
					setStrategyStatus={setStrategyStatus}
					handleRefreshStategies={handleRefreshStategies}
					onClose={() => {
						setOpen(false);
					}}
				/>
			)}
			{maintenanceOpen && (
				<MaintenanceDialog
					open={maintenanceOpen}
					selectedStrategy={selectedStrategy}
					setSelectedStrategy={setSelectedStrategy}
					onClose={() => {
						setMeintenanceOpen(false);
						handleRefreshStategies();
					}}
				/>
			)}
		</Box>
	);
}
