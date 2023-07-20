import { createContext, useEffect, useState } from "react";
import GaugeChart from "react-gauge-chart";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
	Box,
	Button,
	Chip,
	Grid,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableRow,
	Typography,
} from "@mui/material";

import { EXCHANGE_TEXT_MAP } from "constants";

import { CustomTableHead, RobotDialog, RouteLayout } from "components";

import { useDashboardApi } from "api/dashboard";
import { usePlatformApi } from "api/platform";
import { useStrategyApi } from "api/strategy";

import { setParities } from "actions/ParityActions";
import { setStrategies } from "actions/StrategyActions";

import useQuery from "utils/useQuery";

import { FollowNoStrategy, Settings as SettingsSvg, SignalVirtual, Virtual } from "images";

import { STRATEGIES_HEAD_CELLS } from "./Constants";
import { AverageProfit, Info, OpenClosePos, Side, Status } from "./columns";
import TotalProfit from "./columns/TotalProfit";
import { Filter } from "./filter";

export const StrategiesContext = createContext();

export default function Strategies() {
	const { strategies } = useSelector((state) => state.strategy);
	const { profile } = useSelector((state) => state.user);

	const [open, setOpen] = useState(false);
	const [portfolio, setPortfolio] = useState(false);
	const [selectedStrategyFollower, setSelectedStrategyFollower] = useState();
	const [processing, setProcessing] = useState(false);
	const [archivedShown, setArchivedShown] = useState(false);
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const query = useQuery();
	const navigate = useNavigate();

	const { getFollowedStrategies, getArchive } = useStrategyApi();
	const { getParities } = usePlatformApi();
	const { getPortfolio } = useDashboardApi();

	useEffect(() => {
		setProcessing(true);

		Promise.all([
			getParities().then((data) => dispatch(setParities(data))),
			getPortfolio().then((data) => setPortfolio(data)),
			getArchive().then((data) => {
				if (data.length > 0) setArchivedShown(true);
				if (query.get("archived")) dispatch(setStrategies(data));
			}),
			getFollowedStrategies().then((data) => {
				if (!query.get("archived")) dispatch(setStrategies(data));
			}),
		]).finally(() => {
			setProcessing(false);
		});
	}, [query]);

	return (
		<RouteLayout header={t("Robots")}>
			<Filter archivedShown={archivedShown} />
			<TableContainer>
				<Table
					sx={{
						minWidth: 750,
						borderCollapse: "separate",
						borderSpacing: "0 0.75rem",
					}}
				>
					<CustomTableHead headCells={STRATEGIES_HEAD_CELLS(t)} />

					{strategies?.length ? (
						<TableBody
							sx={{
								backgroundColor: "#F0F0F5",
								borderRadius: "8px",
							}}
						>
							{strategies.map(
								(
									{
										blacklist,
										budgetSettings,
										positionSettings,
										strategy,
										strategyFollowerStatistics,
										virtual,
										status,
									},
									ix
								) => {
									return (
										<TableRow key={strategy.id} sx={{ backgroundColor: "#FFFFFF" }}>
											<TableCell>
												<Status
													status={status}
													strategyFollowerStatistics={strategyFollowerStatistics}
												/>
											</TableCell>
											<TableCell width="15%">
												<Info
													{...(strategy?.marketStrategy?.id
														? {
																href: `/marketplace/strategy/${strategy?.marketStrategy?.id}`,
														  }
														: {})}
													virtual={virtual}
													name={strategy?.marketStrategy?.name ?? strategy?.name}
													quote={strategy?.parities?.quotes?.[0]}
													strategyType={strategy?.strategyTypeId}
													isPublic={strategy?.public}
												/>
											</TableCell>

											<TableCell>
												{strategy?.marketStrategy?.merchant?.id ? (
													<Typography
														fontWeight={500}
														sx={{
															cursor: "pointer",
														}}
														onClick={() =>
															navigate(
																`/marketplace/merchant/${strategy.marketStrategy.merchant.id}`
															)
														}
													>
														{strategy?.marketStrategy?.merchant?.nickname}
													</Typography>
												) : (
													<Typography>{t("control_panel_robot_table_own")}</Typography>
												)}
											</TableCell>

											<TableCell>
												<Side label={strategy?.executionType} />
											</TableCell>

											<TableCell>
												<Chip
													label={EXCHANGE_TEXT_MAP[strategy?.platform?.exchange]}
													size="small"
													sx={{
														paddingLeft: 0.5,
														borderRadius: 2,
														backgroundColor: (theme) => theme.palette.info.light,
														color: (theme) => theme.palette.primary.main,
													}}
												/>
											</TableCell>

											<TableCell>
												<AverageProfit profit={strategyFollowerStatistics?.averageProfit} />
											</TableCell>
											<TableCell>
												<OpenClosePos successInfo={strategyFollowerStatistics} />
											</TableCell>
											<TableCell>
												{strategyFollowerStatistics == null ||
												strategyFollowerStatistics?.closedPositionsCount === 0 ? (
													<Typography sx={{ textAlign: "center" }}>
														{t("control_panel_robots_table_no_closed_positions")}
													</Typography>
												) : (
													<GaugeChart
														id="gauge-chart3"
														style={{
															width: "100px",
															marginLeft: "0px",
															fontWeight: "500",
															lineHeight: "18px",
														}}
														colors={["#0F20E8", "#F4F5FC"]}
														nrOfLevels={2}
														arcsLength={[
															strategyFollowerStatistics?.successRatio / 100,
															(100 - strategyFollowerStatistics?.successRatio) / 100,
														]}
														arcWidth={0.1}
														arcPadding={0}
														percent={strategyFollowerStatistics?.successRatio / 100}
														textColor="#0F20E8"
														fontSize={14}
														needleColor={"#FFF"}
														needleBaseColor={"#FFF"}
														marginInPercent={0.01}
													/>
												)}
											</TableCell>
											<TableCell>
												<TotalProfit profit={strategyFollowerStatistics?.totalProfit} />
											</TableCell>
											{query.get("archived") ? (
												<TableCell />
											) : (
												<TableCell>
													<SettingsSvg
														style={{ cursor: "pointer" }}
														onClick={() => {
															setOpen(true);
															setSelectedStrategyFollower({
																strategy,
																blacklist,
																status,
																virtual,
																budgetSettings,
																positionSettings,
															});
														}}
													></SettingsSvg>
												</TableCell>
											)}
										</TableRow>
									);
								}
							)}
						</TableBody>
					) : (
						<></>
					)}
				</Table>

				{open && (
					<RobotDialog
						selectedStrategyFollower={selectedStrategyFollower}
						setSelectedStrategyFollower={setSelectedStrategyFollower}
						portfolio={portfolio}
						open={open}
						onClose={() => {
							setOpen();
							setSelectedStrategyFollower();
						}}
						onSave={(_) => {
							setOpen(false);
							setSelectedStrategyFollower();
						}}
					/>
				)}
			</TableContainer>
			{strategies?.length ? (
				<Grid container>
					<Grid xs={9}></Grid>
					<Grid xs={0.3}>
						<SignalVirtual />
					</Grid>
					<Grid xs={1.2}>
						<Typography sx={{ color: (theme) => theme.palette.primary.main, fontSize: "14px" }}>
							{t("control_panel_robots_help_virtual_signal")}
						</Typography>
					</Grid>
					<Grid xs={0.3}>
						<Virtual width={24} height={24} />
					</Grid>
					<Grid xs={1.2}>
						<Typography sx={{ color: (theme) => theme.palette.primary.main, fontSize: "14px" }}>
							{t("control_panel_robots_help_virtual_trade")}
						</Typography>
					</Grid>
				</Grid>
			) : (
				<></>
			)}
			{!strategies?.length && (
				<Box
					width="100%"
					display="flex"
					flexDirection="column"
					justifyContent="center"
					alignItems="center"
					sx={{ borderRadius: "8px", backgroundColor: "#fff", py: "50px" }}
				>
					<Box>
						<FollowNoStrategy />
					</Box>
					<Typography color="primary" fontSize={24} fontWeight={700} mt={4}>
						{t("Oops! You have no active trading robots.")}
					</Typography>
					<Button
						onClick={() => navigate("/marketplace")}
						variant="contained"
						sx={{
							marginTop: "1rem",
							width: "360px",
							height: "42px",
						}}
					>
						Browse Strategies
					</Button>
				</Box>
			)}
		</RouteLayout>
	);
}
