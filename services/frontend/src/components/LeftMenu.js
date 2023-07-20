import * as React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import {
	Box,
	Divider,
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Drawer as MuiDrawer,
	Typography,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";

import {
	Header,
	Logo,
	MenuDashboard,
	MenuExchange,
	MenuExpert,
	MenuMarketPlace,
	MenuPositionsCenter,
	MenuRobots,
	MenuWallet,
	MenuWorkshop,
} from "images";

import { Questbox } from "../images";
import ExploreModeTooltip from "./ExploreModeTooltip";

const drawerWidth = 280;

const openedMixin = (theme) => ({
	width: drawerWidth,
	transition: theme.transitions.create("width", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.enteringScreen,
	}),
	overflowX: "hidden",
});

const closedMixin = (theme) => ({
	transition: theme.transitions.create("width", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	overflowX: "hidden",
	width: `calc(${theme.spacing(8)} + 1px)`,
	[theme.breakpoints.up("sm")]: {
		width: `calc(${theme.spacing(9)} + 1px)`,
	},
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== "open" })(({ theme, open }) => ({
	width: drawerWidth,
	flexShrink: 0,
	whiteSpace: "nowrap",
	boxSizing: "border-box",
	left: 5,
	...(open && {
		...openedMixin(theme),
		"& .MuiDrawer-paper": openedMixin(theme),
	}),
	...(!open && {
		...closedMixin(theme),
		"& .MuiDrawer-paper": closedMixin(theme),
	}),
}));

const MenuItem = ({ open, path }) => {
	const theme = useTheme();
	const location = useLocation();
	const navigate = useNavigate();
	const { name, title, icon: Icon, disabled } = path;

	const active = location.pathname === name;

	return (
		<ExploreModeTooltip
			title={<Typography sx={{ fontSize: "14px" }}>Referral Only Access</Typography>}
			enabled={disabled}
			placement="right"
		>
			<ListItemButton
				{...(!disabled ? { onClick: () => navigate(name) } : {})}
				key={title}
				sx={{
					minHeight: 48,
					mx: 2,
					mb: 1,
					// opacity: disabled ? "0.5" : "100% !important",
					borderRadius: "8px",
					justifyContent: open ? "initial" : "center",
					px: 0.2,
					color: disabled ? theme.palette.info.dark : "inherit",
					backgroundColor: disabled ? theme.palette.info.main : active ? theme.palette.info.light : "none",
				}}
			>
				<ListItemIcon
					sx={{
						width: "40px",
						mr: open ? 0.6 : "auto",
						justifyContent: "center",
					}}
				>
					<Icon active={active} disabled={disabled} />
				</ListItemIcon>

				{open && (
					<ListItemText
						disableTypography
						primary={
							<Typography
								sx={{
									color: disabled
										? theme.palette.info.dark
										: active
										? theme.palette.primary.main
										: theme.palette.primary.light,
									fontWeight: "bold",
								}}
							>
								{title}
							</Typography>
						}
					/>
				)}
			</ListItemButton>
		</ExploreModeTooltip>
	);
};

export default function LeftMenu() {
	const { profile } = useSelector((state) => state.user);

	const [open, setOpen] = React.useState(false);
	const { t } = useTranslation("common");
	const navigate = useNavigate();

	const PATHS = [
		{
			name: "/dashboard",
			title: t("navigation_menu_dashboard"),
			icon: MenuDashboard,
			disabled: false,
		},

		{
			name: "/marketplace",
			title: t("navigation_menu_marketplace"),
			icon: MenuMarketPlace,
			disabled: false,
		},
		{
			name: "/quest-box",
			title: "Questbox",
			icon: Questbox,
		},
		{
			name: "/workshop",
			title: t("navigation_menu_workshop"),
			icon: MenuWorkshop,
			disabled: false,
		},
		{
			name: "/strategies",
			title: t("navigation_menu_strategies"),
			icon: MenuRobots,
			disabled: false,
		},
		{
			name: "/positions-center",
			title: t("navigation_menu_positions_center"),
			icon: MenuPositionsCenter,
			disabled: false,
		},
		{
			name: "/exchange-link",
			title: t("navigation_menu_exchange_connections"),
			icon: MenuExchange,
			disabled: false,
		},
		{
			name: "/payment",
			title: t("navigation_menu_wallet"),
			icon: MenuWallet,
			disabled: false,
		},
		...(profile?.merchant?.id && profile?.merchant?.progressStatus === "ACCEPTED"
			? [
					{
						name: `/expert-panel/${profile?.merchant?.id}`,
						title: t("navigation_menu_expert_panel"),
						icon: MenuExpert,
						disabled: false,
					},
			  ]
			: []),
	];

	return (
		<Box display="flex" sx={{ marginLeft: "50px", display: { xs: "none", sm: "none", md: "block" } }}>
			<Drawer
				variant="permanent"
				open={open}
				onMouseOver={(x) => setOpen(true)}
				onMouseLeave={(x) => setOpen(false)}
			>
				<Box onClick={() => navigate("/")} sx={{ cursor: "pointer", mt: 1, mb: 1, textAlign: "center" }}>
					{open ? <Logo /> : <Header />}
				</Box>
				<Divider />
				<List>
					{PATHS.map((path, ix) => (
						<MenuItem key={ix} path={path} open={open} />
					))}
				</List>
			</Drawer>
		</Box>
	);
}
