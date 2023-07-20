import { useContext, useState } from "react";
import { useDispatch } from "react-redux";

import { Box, Button, Grid, Typography } from "@mui/material";

import { useSnackbar } from "notistack";

import { Dialog, PageCenteredProgress, TextField } from "components";

import { waiting } from "images";

import { setProfile } from "../actions/UserActions";
import useCatchError from "../api/useCatchError";
import { useUserApi } from "../api/user";
import { ReferralContext } from "../scenes/Main";

export default function ReferralCodeDialog() {
	const catchError = useCatchError();
	const { updateUsedReferenceCode, getProfile } = useUserApi();
	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();

	const { open, setOpen } = useContext(ReferralContext);

	const [referenceCode, setReferenceCode] = useState();
	const [error, setError] = useState();
	const [processing, setProcessing] = useState(false);

	const handleSubmit = () => {
		if (!referenceCode) {
			setError(true);
			enqueueSnackbar("Referral code is invalid.", { variant: "error" });
			return;
		}

		setProcessing(true);

		updateUsedReferenceCode({
			referenceCode,
		})
			.then(() => getProfile())
			.then((data) => {
				dispatch(setProfile(data?.data?.profile));

				enqueueSnackbar("You have successfully entered the referral code.", { variant: "success" });

				setOpen(false);
			})
			.catch(catchError)
			.finally(() => setProcessing(false));
	};

	return (
		<>
			{processing && <PageCenteredProgress />}
			<Dialog
				dialogProps={{ open, onClose: () => setOpen(false) }}
				title={<Box component="img" src={waiting} />}
				content={
					<>
						<Typography fontWeight={"Bold"} sx={{ mt: 2, textAlign: "center", fontSize: "24px" }}>
							Enter Referral Code
						</Typography>

						<Typography sx={{ mt: 2, textAlign: "center", fontSize: "14px" }}>
							Experience Traderlands features in full before the mass launch as one of our valued early
							adopters!
						</Typography>

						<Grid
							container
							spacing={0}
							direction="column"
							alignItems="center"
							justifyContent="center"
							sx={{ mt: 2 }}
						>
							<Grid item xs={12}>
								<TextField
									error={error}
									margin="normal"
									required
									fullWidth
									label={"Referral Code"}
									onChange={(e) => setReferenceCode(e.target.value)}
									onKeyPress={(e) => {
										if (e.key === "Enter") {
											handleSubmit();
										}
									}}
									value={referenceCode ?? ""}
								/>
							</Grid>
						</Grid>

						<Button
							variant="contained"
							sx={{ mt: 4, width: "300px", py: 1.5, fontSize: "16px" }}
							color="primary"
							disabled={processing}
							onClick={() => handleSubmit()}
						>
							Let's Go
						</Button>
					</>
				}
			/>
		</>
	);
}
