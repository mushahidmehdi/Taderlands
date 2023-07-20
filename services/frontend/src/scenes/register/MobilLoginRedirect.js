import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Box, Button, IconButton, Menu, MenuItem, Toolbar, Typography } from "@mui/material";

import { setMaster } from "actions/MasterActions";
import { reset } from "actions/StrategyBuilderActions";
import { setJwt } from "actions/jwtActions";

import { AppStore, Close, GooglePlay, BreadCrum, StagedLogo, BlueSmallLogo } from "images";

const MobilLoginRedirect = () => {
	const { profile } = useSelector((state) => state.user);

	const { t } = useTranslation("dashboard");
	const navigate = useNavigate();
	const [anchorEl, setAnchorEl] = useState(null);
	const [selection, setSelection] = useState();
	const open = Boolean(anchorEl);
	const dispatch = useDispatch();

	function maskEmail(email) {
		const firstFew = email.substring(0, 3);
		const domain = email.substring(email.indexOf("@") + 1);
		return firstFew + "***** @" + domain;
	}

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleLogout = () => {
		setSelection("logout");

		setAnchorEl(null);
	};

	const handleProfile = (e) => {
		setSelection("profile");

		setAnchorEl(null);
	};

	const handleClick = (e) => {
		setAnchorEl(e.currentTarget);
	};

	const handleWallet = () => {
		setSelection("wallet");

		setAnchorEl(null);
	};

	useEffect(() => {
		if (selection === "wallet" && !anchorEl) {
			navigate("/payment");
		}

		if (selection === "profile" && !anchorEl) {
			navigate("/mobile-redirect");
		}

		if (selection === "logout" && !anchorEl) {
			dispatch(setJwt(null));
			dispatch(setMaster(null));
			dispatch(reset());

			navigate("/");
		}
	}, [selection, anchorEl, navigate, dispatch]);

	return (
		<Box bgcolor="background: #E5E5E5" p="1rem">
			<Box display="flex" justifyContent="space-between" alignItems="center" marginY="1.5rem" position="relative">
				<BlueSmallLogo />
				<Toolbar>
					<IconButton size="small" onClick={handleClick}>
						{anchorEl ? <Close /> : <BreadCrum />}
					</IconButton>

					<Menu
						id="basic-menu"
						anchorEl={anchorEl}
						open={open}
						onClose={handleClose}
						MenuListProps={{
							"aria-labelledby": "basic-button",
						}}
					>
						<MenuItem name="profile" onClick={handleProfile}>
							{t("dashboard_mobile_home")}
						</MenuItem>
						<MenuItem name="logout" onClick={handleWallet}>
							{t("dashboard_mobile_wallet")}
						</MenuItem>
						<MenuItem name="logout" onClick={handleLogout}>
							{t("dashboard_mobile_logout")}
						</MenuItem>
					</Menu>
				</Toolbar>
			</Box>

			<Typography
				fontWeight={"Bold"}
				sx={{
					mt: 2,
					fontSize: "0.9rem",
					fontWeight: 400,
					color: "#3A3A3A",
				}}
			>
				Hi{" "}
				<span
					style={{
						color: "#6A1FC2",
						fontSize: "0.9rem",
						fontWeight: 700,
					}}
				>
					{maskEmail(profile.email)}
				</span>{" "}
				Welcome,
			</Typography>

			<Box bgcolor="#fff" borderRadius="0.5rem" p="1rem" mt="1rem">
				<Box display="flex" justifyContent="center" alignItems="center" marginBlock="3rem">
					<StagedLogo />
				</Box>

				<Typography
					fontWeight={"Bold"}
					sx={{
						color: (theme) => theme.palette.primary.main,
						mt: 1,
						fontSize: "2rem",
						textAlign: "center",
					}}
				>
					{t("dashboard_welcome_title")}
				</Typography>

				<Typography
					sx={{
						color: "#000",
						mt: 2,
						textAlign: "start",
						fontSize: "16px",
					}}
				>
					{t("dashboard_mobile_des_above")}

					<Typography mt={4}>{t("dashboard_mobile_des_below")}</Typography>
				</Typography>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						marginBlockStart: "2rem",
						gap: 0.6,
					}}
				>
					<AppStore />
					<GooglePlay />
				</Box>
				<Box>
					<Button
						onClick={handleWallet}
						variant="contained"
						sx={{
							width: "100%",
							padding: "0.8rem 1rem",
							marginTop: "2rem",
						}}
					>
						Wallet
					</Button>
				</Box>
			</Box>
		</Box>
	);
};

export default MobilLoginRedirect;
