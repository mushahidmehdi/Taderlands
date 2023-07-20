import { createContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { IntercomProvider } from "react-use-intercom";

import { Box, useMediaQuery } from "@mui/material";

import { LeftMenu, ReferralCodeDialog, TopMenu } from "components";

import { setProfile } from "../actions/UserActions";
import { useUserApi } from "../api/user";
import { Config } from "../services";

export const ReferralContext = createContext();

export default function Main() {
	const { profile } = useSelector((state) => state.user);
	const matches = useMediaQuery("(max-width:900px)", { noSsr: true });
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { i18n } = useTranslation();
	const { getProfile } = useUserApi();

	const [open, setOpen] = useState(false);

	useEffect(() => {
		getProfile().then((data) => {
			dispatch(setProfile(data?.data?.profile));
		});
		i18n.changeLanguage("en-us");
	}, []);

	if (matches && !location.pathname.startsWith("/payment")) {
		return navigate("/mobile-redirect");
	}

	return (
		<IntercomProvider
			appId={Config.intercomAppId()}
			autoBoot
			autoBootProps={{
				alignment: "right",
				horizontalPadding: 40,
				verticalPadding: 40,
				email: profile?.email,
				phone: profile?.phoneNumber,
				...profile?.userBrief,
			}}
		>
			<ReferralContext.Provider value={{ open, setOpen }}>
				<Box sx={{ display: "flex" }}>
					<LeftMenu></LeftMenu>
					<TopMenu></TopMenu>
					{open && <ReferralCodeDialog />}
					<Outlet />
				</Box>
			</ReferralContext.Provider>
		</IntercomProvider>
	);
}
