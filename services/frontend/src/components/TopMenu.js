import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { AppBar, Box, IconButton, Menu, MenuItem, Toolbar, useMediaQuery } from "@mui/material";

import { Account, BreadCrum, Close, Notification, ReturnBack, Wallet2 } from "images";

import { ReferralContext } from "../scenes/Main";

export default function TopMenu() {
	const { profile } = useSelector((state) => state.user);

	const { open: referralOpen, setOpen: setReferralOpen } = useContext(ReferralContext);

	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);
	const [selection, setSelection] = useState();

	// eslint-disable-next-line react-hooks/rules-of-hooks
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleClick = (e) => {
		setAnchorEl(e.currentTarget);
	};

	const handleProfile = (e) => {
		setSelection("profile");

		setAnchorEl(null);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleNotification = () => {
		navigate("/notification");
	};

	const handleWallet = () => {
		navigate("/payment");
	};

	const handleLogout = () => {
		setSelection("logout");

		setAnchorEl(null);
	};

	const matches = useMediaQuery("(max-width:900px)", { noSsr: true });

	useEffect(() => {
		if (selection === "profile" && !anchorEl) {
			navigate("/account-center");
		}

		if (selection === "logout" && !anchorEl) {
			localStorage.clear();

			window.location.replace("/login");
		}
	}, [selection, anchorEl]);

	return (
		<AppBar
			position="absolute"
			sx={{
				boxShadow: 0,
				borderWidth: 0,
				backgroundColor: "#FAFAFE",
			}}
		>
			{matches ? (
				<Box>
					<Toolbar>
						<Box display="flex" justifyContent="space-between" width="100%">
							<IconButton size="small" onClick={handleWallet}>
								<ReturnBack onClick={handleProfile} />
							</IconButton>

							<IconButton size="small" onClick={handleClick}>
								{anchorEl ? <Close /> : <BreadCrum />}
							</IconButton>
						</Box>

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
								{t("top_bar_mobile_home")}
							</MenuItem>

							<MenuItem name="wallet" onClick={() => setReferralOpen(true)}>
								{t("top_bar_mobile_wallet")}
							</MenuItem>

							<MenuItem name="logout" onClick={handleLogout}>
								{t("top_bar_logout_text")}
							</MenuItem>
						</Menu>
					</Toolbar>
				</Box>
			) : (
				<Toolbar
					sx={{
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "end",
						paddingLeft: "36px",
						paddingRight: "36px",
					}}
				>
					<IconButton size="small" onClick={handleWallet}>
						<Wallet2 />
					</IconButton>

					<IconButton size="small" onClick={handleNotification}>
						<Notification />
					</IconButton>
					<IconButton size="small" onClick={handleClick}>
						<Account />
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
							{t("top_bar_profile_text")}
						</MenuItem>
						<MenuItem name="logout" onClick={handleLogout}>
							{t("top_bar_logout_text")}
						</MenuItem>
					</Menu>
				</Toolbar>
			)}
		</AppBar>
	);
}
