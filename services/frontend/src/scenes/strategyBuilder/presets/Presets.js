import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { Add } from "@mui/icons-material";
import { Button, List, Paper, Typography } from "@mui/material";

import { pick } from "lodash";
import { useSnackbar } from "notistack";

import { SmallText, TextField } from "components";

import { useStrategyApi } from "api/strategy";
import useCatchError from "api/useCatchError";

import { setStrategy } from "actions/StrategyBuilderActions";

import { useFetchAuthorized } from "services";

import { StrategyBuilderContext } from "../StrategyBuilder";
import ChooseExecutionType from "./ChooseExecutionType";
import ChoosePair from "./ChoosePair";
import PlatformDialog from "./PlatformDialog";
import PlatformItem from "./PlatformItem";
import WebhookSettings from "./WebhookSettings";

export default function Presets() {
	const { strategy } = useSelector((state) => state.strategyBuilder);
	const { platforms } = useSelector((state) => state.platform);
	const { profile } = useSelector((state) => state.user);

	const [open, setOpen] = useState();
	const [openWebhook, setOpenWebhook] = useState();

	const { statusMap, status, setStatus } = useContext(StrategyBuilderContext);

	const dispatch = useDispatch();
	const fetchAuthorized = useFetchAuthorized();
	const { t } = useTranslation("workshop");
	const { enqueueSnackbar } = useSnackbar();

	const { updateStrategy, createStrategy } = useStrategyApi();
	const catchError = useCatchError();

	const selectedPlatform = platforms?.find((x) => x.id === strategy?.platformId);

	const validate = () => {
		if (!strategy?.name) {
			enqueueSnackbar(t("error.Name should not be empty"), { variant: "error" });
			setStatus();
			return;
		}

		if (!strategy?.platformId) {
			enqueueSnackbar(t("error.Exchange should not be empty"), { variant: "error" });
			setStatus();
			return;
		}

		if (!strategy?.parities || strategy?.parities?.symbols?.length <= 0) {
			enqueueSnackbar(t("error.Parities should not be empty"), { variant: "error" });
			setStatus();
			return;
		}

		if (
			platforms.find((x) => x.id === strategy?.platformId)?.info.marketTypes.includes("FUTURES") &&
			!strategy.executionType
		) {
			enqueueSnackbar(t("error.Execution type should not be empty"), { variant: "error" });
			setStatus();
			return;
		}

		return true;
	};

	useEffect(() => {
		if (["continue", "save"].some((x) => x === status)) {
			if (!validate()) {
				return;
			}

			(strategy?.id
				? updateStrategy(strategy?.id, {
						...pick(strategy, ["name", "platformId", "parities", "executionType"]),
				  })
				: createStrategy({
						...pick(strategy, ["name", "platformId", "parities", "executionType", "strategyTypeId"]),
						tradeTypeId: 1,
						ruleDesignEnterId: 1,
						status: "OFF",
						public: 0,
				  })
			)
				.then((data) => {
					if (data?.data?.strategy) {
						dispatch(setStrategy({ ...strategy, ...data?.data?.strategy }));

						enqueueSnackbar(t("All information saved successfully"), { variant: "success" });

						if (data?.data?.strategy?.strategyTypeId === 2) {
							setOpenWebhook(true);
						} else {
							setStatus(statusMap[status]);
						}
					}
				})
				.catch((err) => {
					catchError(err);
					setStatus();
				});
		}
	}, [status]);

	return (
		<Paper sx={{ padding: "24px", marginBottom: "16px" }}>
			<Typography sx={{ fontSize: "24px", fontWeight: 700, marginBottom: "8px" }}>
				{t("workshop_presets_main_title")}
			</Typography>
			<Typography variant="p" sx={{ color: "#3A3A3A", fontSize: "14px" }}>
				{t("workshop_presets_main_text")}
			</Typography>
			<TextField
				margin="normal"
				fullWidth
				label={t("workshop_presets_strategy_name_title")}
				labelProps={{ sx: { color: (theme) => theme.palette.primary.main } }}
				containerProps={{ sx: { mt: 2 } }}
				value={strategy?.name ?? ""}
				onChange={(e) => dispatch(setStrategy({ ...strategy, name: e.target.value }))}
				inputProps={{ maxLength: 32 }}
			/>
			<List>
				<Button
					variant="text"
					startIcon={<Add />}
					onClick={() => setOpen(true)}
					disabled={Boolean(strategy?.public || strategy?.openPositionsCount)}
					sx={{ textAlign: "left", marginBottom: 1, fontSize: "1rem" }}
				>
					{strategy?.platformId
						? t("workshop_presets_choose_exchange_change_title")
						: t("workshop_presets_choose_exchange_title")}
				</Button>
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
				{strategy?.platformId && <PlatformItem strategy={strategy} platform={selectedPlatform} />}
			</List>
			{selectedPlatform?.info?.marketTypes?.some((x) => x !== "SPOT") && <ChooseExecutionType />}
			<ChoosePair />
			{open && platforms && (
				<PlatformDialog
					open={open}
					onClose={() => {
						setOpen(false);
					}}
				/>
			)}
			{openWebhook && (
				<WebhookSettings
					open={openWebhook}
					onClose={() => setOpenWebhook(false)}
					disableBackdropClick
					showContinue
					onAccept={() => {
						setOpenWebhook(false);
						setStatus(statusMap[status]);
					}}
				/>
			)}
		</Paper>
	);
}
