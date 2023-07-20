import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Button, Grid, IconButton, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";

import { EXCHANGE_TEXT_MAP } from "constants";

import { Chip, ExploreModeTooltip, PageCenteredProgress, RobotDialog } from "components";
import SuccessDialog from "components/Protection/SuccessDialog";

import { useMarketplaceApi } from "api/marketplace";
import { useStrategyApi } from "api/strategy";
import useCatchError from "api/useCatchError";
import { useUserApi } from "api/user";

import { setProfile } from "actions/UserActions";

import { Config } from "services";

import { Info as InfoIcon, SideLong, Success2 } from "images";

import CopyDialog from "./CopyDialog";
import Pairs from "./SelectedPairsDialog";
import { MarketStrategyContext } from "./Strategy";

const ParitiesNecklace = ({ parities, symbols, onClick }) => (
	<Grid container>
		{parities &&
			parities.slice(0, 10).map(({ base }, ix) => (
				<Grid item key={ix}>
					<img
						style={{ marginRight: "-8px" }}
						width="24px"
						height="24px"
						src={`${Config.cdnRoot()}/general/crypto-icons/${base}.png`}
					/>
				</Grid>
			))}
		<Grid item>
			<IconButton
				sx={{
					mt: "-4px",
					ml: 1,
					fontWeight: "bold",
					paddingLeft: 0,
					paddingRight: 0,
					minWidth: "32px",
					"&:hover": {
						textDecoration: "underline",
					},
				}}
				onClick={() => onClick()}
				variant="text"
			>
				<InfoIcon style={{ color: "#0F20E8" }} />
			</IconButton>
		</Grid>
	</Grid>
);

export default function Header() {
	const [processing, setProcessing] = useState();
	const [open, setOpen] = useState();

	const { marketStrategy, setMarketStrategy, followedStrategy, setFollowedStrategy, portfolio } =
		useContext(MarketStrategyContext);
	const { merchant, strategy, pricing } = marketStrategy;

	const { profile } = useSelector((state) => state.user);
	const { parities: allParities } = useSelector((state) => state.parity);
	const parities = allParities.filter((x) => strategy?.parities?.symbols?.some((y) => y === x.id));

	const startDisabled =
		marketStrategy.followerCount >= (marketStrategy?.maxFollowerCount ?? 250) ||
		profile.strategyFollowers.filter((item) => {
			return (
				item.strategy?.public === 1 &&
				item.strategy?.platformId === strategy?.platform?.id &&
				profile?.merchant?.id !== item.strategy?.marketStrategy?.merchantId
			);
		})?.length >= 5;

	const navigate = useNavigate();
	const { t } = useTranslation("marketplace");
	const { followMarketStrategy, getMarketStrategy } = useMarketplaceApi();
	const { getFollowedStrategies } = useStrategyApi();
	const { getProfile } = useUserApi();
	const catchError = useCatchError();
	const dispatch = useDispatch();

	const handleCopyStrategy = () => {
		setProcessing(true);

		setOpen();

		followMarketStrategy(marketStrategy?.id)
			.then(() => {
				setProcessing(false);
				setOpen({ success: true });
			})
			.catch(catchError)
			.finally(() => setProcessing(false));
	};

	const handleCloseFollowSuccess = (openBudgetSettings) => {
		Promise.all([
			getProfile().then((data) => dispatch(setProfile(data?.data?.profile))),
			getFollowedStrategies(marketStrategy?.strategyId).then((data) => {
				setFollowedStrategy(data[0]);
			}),
			getMarketStrategy(marketStrategy?.id).then((data) => {
				setMarketStrategy(data);
			}),
		]).then(() => {
			setOpen(openBudgetSettings && { budgetSettings: true });
		});
	};

	return (
		<>
			{processing && <PageCenteredProgress open={processing} />}
			{open?.success && (
				<SuccessDialog
					open={open?.success}
					onClose={() => setOpen()}
					icon={<Success2 />}
					title={
						<Typography fontWeight={"Bold"} sx={{ mt: 2, textAlign: "center", fontSize: "24px" }}>
							{t("marketplace_strategy_page_follow_modal_success_main_title")}
						</Typography>
					}
					content={
						<Typography sx={{ mt: 2, textAlign: "center", fontSize: "14px" }}>
							{t("marketplace_strategy_page_follow_modal_success_main_text")}
						</Typography>
					}
					actions={
						<Grid
							container
							spacing={2}
							direction="column"
							alignItems="center"
							justifyContent="center"
							sx={{ mt: 2 }}
						>
							<Grid item xs={12}>
								<Button
									variant="contained"
									color="secondary"
									sx={{ width: "360px" }}
									onClick={() => handleCloseFollowSuccess(true)}
								>
									{t(
										"marketplace_strategy_page_follow_modal_success_budget_settings_direction_button_text"
									)}
								</Button>
							</Grid>

							<Grid item xs={12}>
								<Button
									variant="outlined"
									color="primary"
									sx={{ width: "360px" }}
									onClick={() => handleCloseFollowSuccess()}
								>
									{t(
										"marketplace_strategy_page_follow_modal_success_budget_settings_later_button_text"
									)}
								</Button>
							</Grid>
						</Grid>
					}
				/>
			)}
			{open?.budgetSettings && followedStrategy && (
				<RobotDialog
					selectedStrategyFollower={followedStrategy}
					setSelectedStrategyFollower={setFollowedStrategy}
					open={open?.budgetSettings}
					onClose={() => setOpen()}
					budgetOpen={true}
					portfolio={portfolio}
				/>
			)}
			{open?.parities && <Pairs open={open?.parities} onClose={() => setOpen()} parities={parities} />}
			{open?.copy && (
				<CopyDialog
					strategy={strategy}
					pricing={pricing}
					merchant={merchant}
					name={marketStrategy?.name}
					open={open?.copy}
					onClose={() => setOpen()}
					onSubmit={handleCopyStrategy}
				/>
			)}
			<Paper
				sx={{
					padding: "12px",
					mb: 2,
					backgroundColor: "#FFF",
					borderRadius: "7px",
				}}
			>
				<Grid
					container
					spacing={2}
					direction="column"
					alignItems="center"
					justifyContent="center"
					style={{ minHeight: "300px" }}
				>
					<Grid item xs={12}>
						<Typography variant="p" sx={{ fontSize: "24px", color: "#3A3A3A", fontWeight: 700 }}>
							{marketStrategy.name}
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography
							variant="p"
							sx={{ fontSize: "16px", color: "#3A3A3A", fontWeight: 300, cursor: "pointer" }}
							onClick={() => navigate(`/marketplace/merchant/${marketStrategy.merchantId}`)}
						>
							{merchant.nickname}
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography
							variant="p"
							sx={{
								fontSize: "16px",
								color: (theme) =>
									marketStrategy.followerCount >= (marketStrategy?.maxFollowerCount ?? 250)
										? theme.palette.info.dark
										: theme.palette.secondary.main,
								fontWeight: 700,
							}}
						>
							{marketStrategy.followerCount >= (marketStrategy?.maxFollowerCount ?? 250)
								? t("marketplace_main_page_sold_out_text")
								: marketStrategy.followerCount + "/" + (marketStrategy?.maxFollowerCount ?? 250)}
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<Box>
							<Chip
								backgroundColor="#F4F5FC"
								label={EXCHANGE_TEXT_MAP[strategy?.platform?.exchange]}
								sx={{
									fontSize: "16px",
									color: (theme) => theme.palette.primary.main,
									borderRadius: "4px",
									py: 2,
									px: 1,
									mr: 1,
								}}
							/>
							<Chip
								backgroundColor="#0F20E8"
								icon={SideLong}
								label={strategy?.executionType}
								sx={{ fontSize: "16px", color: "#FFF", borderRadius: "4px", py: 2, px: 1 }}
							/>
						</Box>
					</Grid>
					<Grid item xs={12}>
						<ParitiesNecklace
							parities={parities}
							symbols={strategy?.parities?.symbols}
							onClick={() => setOpen({ parities: true })}
						/>
					</Grid>
					<Grid item xs={12}>
						{marketStrategy?.status === "MAINTENANCE" ? (
							<Button disabled={true} variant="contained" color="primary" sx={{ width: "200px" }}>
								{"MAINTENANCE MODE"}
							</Button>
						) : profile.strategyFollowers?.find((item) => item.strategy?.id === strategy?.id) ? (
							<Button
								variant="outlined"
								color="primary"
								sx={{ width: "200px" }}
								onClick={() => setOpen({ budgetSettings: true })}
							>
								{t("marketplace_strategy_page_budget_settings_button_text")}
							</Button>
						) : (
							<ExploreModeTooltip enabled={false}>
								<Button
									variant="contained"
									color="primary"
									sx={{ width: "200px", ...(startDisabled ? { opacity: "0.3" } : {}) }}
									{...(startDisabled ? {} : { onClick: () => setOpen({ copy: true }) })}
								>
									<span>{t("marketplace_strategy_page_copy_button_text")}</span>
								</Button>
							</ExploreModeTooltip>
						)}
					</Grid>
					{marketStrategy?.status === "MAINTENANCE" && (
						<>
							<Grid xs={1}></Grid>
							<Grid xs={10} sx={{ textAlign: "center" }}>
								<Typography
									sx={{
										mt: "1px",
										fontSize: "12px",
										color: (theme) => theme.palette.warning.main,
									}}
								>
									{t("marketplace_strategy_page_maintenance_warning")}
								</Typography>
							</Grid>
							<Grid xs={1}></Grid>
						</>
					)}
					{marketStrategy.followerCount >= (marketStrategy?.maxFollowerCount ?? 250) && (
						<>
							<Grid xs={1}></Grid>
							<Grid xs={10} sx={{ textAlign: "center" }}>
								<Typography
									sx={{
										mt: "1px",
										fontSize: "12px",
										color: (theme) => theme.palette.danger.main,
									}}
								>
									{t("marketplace_strategy_page_sold_out_warning")}
								</Typography>
							</Grid>
							<Grid xs={1}></Grid>
						</>
					)}
					{!profile.strategyFollowers?.find((item) => item.strategy?.id === strategy?.id) &&
						profile.strategyFollowers.filter(
							(item) =>
								item.strategy?.public === 1 &&
								item.strategy?.platformId === strategy?.platform?.id &&
								profile?.merchant?.id !== item.strategy?.marketStrategy?.merchantId
						)?.length >= 5 && (
							<>
								<Grid xs={1}></Grid>
								<Grid xs={10} sx={{ textAlign: "center" }}>
									<Typography
										sx={{
											mt: "1px",
											fontSize: "12px",
											color: (theme) => theme.palette.danger.main,
										}}
									>
										{t("marketplace_strategy_use_maximum_limit_warning")}
									</Typography>
								</Grid>
								<Grid xs={1}></Grid>
							</>
						)}
				</Grid>
			</Paper>
		</>
	);
}
