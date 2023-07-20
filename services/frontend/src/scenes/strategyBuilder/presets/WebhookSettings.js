import { useSelector } from "react-redux";

import { Button, Grid, IconButton, InputAdornment, Typography } from "@mui/material";

import { Dialog, TextField } from "components";

import { Config } from "services";

import useCopyToClipboard from "utils/useCopyToClipboard";

import { CopyClipboard } from "images";

export default function WebhookSettings({ open, onClose, showContinue, onAccept, disableBackdropClick }) {
	const { strategy } = useSelector((state) => state.strategyBuilder);
	const copyToClipboard = useCopyToClipboard();
	const json = `{
    "strategyId": ${strategy?.id},
    "token": "${strategy?.webhookToken}",
    "ticker": "{{ticker}}",
    "exchange": "{{exchange}}",
    "timestamp": "{{timenow}}",
    "side": "{{strategy.order.action}}",
    "price": {{strategy.order.price}},
    "strategy": {
        "order": {
        	"id": "{{strategy.order.id}}",
        	"comment": "{{strategy.order.comment}}",
        	"alertMessage": "{{strategy.order.alert_message}}"
        },
        "marketPosition": "{{strategy.market_position}}",
        "prevMarketPosition": "{{strategy.prev_market_position}}"
    }
}`;

	const webhookUrl = `${Config.apiRoot()}/signal/external`;

	return (
		<Dialog
			dialogProps={{ open, maxWidth: "lg", onClose, disableBackdropClick }}
			title="Webhook Settings"
			content={
				<Grid container spacing={2} sx={{ width: "70%" }}>
					<Grid item xs={12} sx={{ textAlign: "center" }}>
						<Typography>
							You can easily turn the strategies you have developed on Tradingview into automated trading
							robots by importing them to Traderlands.
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<TextField
							label={
								<>
									Webhook Address
									<IconButton
										onClick={() => {
											copyToClipboard(webhookUrl);
										}}
									>
										<CopyClipboard />
									</IconButton>
								</>
							}
							value={webhookUrl}
							fullWidth
							disabled
							endAdornment={
								<InputAdornment position="end">
									<IconButton
										onClick={() => {
											copyToClipboard(webhookUrl);
										}}
									>
										<CopyClipboard />
									</IconButton>
								</InputAdornment>
							}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							label={
								<>
									Webhook Message
									<IconButton
										onClick={() => {
											copyToClipboard(json);
										}}
									>
										<CopyClipboard />
									</IconButton>
								</>
							}
							disabled
							fullWidth
							multiline
							maxRows={Infinity}
							value={json}
						/>
					</Grid>
				</Grid>
			}
			action={
				<>
					{showContinue && (
						<Grid container sx={{ width: "70%", textAlign: "center" }}>
							<Grid item xs={12}>
								<Button
									variant="contained"
									sx={{ backgroundColor: (theme) => theme.palette.primary.main }}
									onClick={() => onAccept()}
								>
									I made webhook settings
								</Button>
							</Grid>
						</Grid>
					)}
				</>
			}
		/>
	);
}
