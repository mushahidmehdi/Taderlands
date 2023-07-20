import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

import { Button, Grid } from "@mui/material";

import useQuery from "utils/useQuery";

export default function LoginRegisterNavigation() {
	const query = useQuery();

	const { t } = useTranslation("register");
	const navigate = useNavigate();
	const location = useLocation();
	const currentTab = location.pathname.endsWith("register") ? "register" : "login";

	return (
		<Grid container sx={{ ml: -0.5, mb: "1.5rem" }}>
			{["login", "register"].map((tab) => (
				<Grid item key={tab}>
					<Button
						size="small"
						sx={{
							fontWeight: "700",
							fontSize: "1.25rem",
							...(currentTab !== tab
								? { color: (theme) => theme.palette.info.dark }
								: { color: (theme) => theme.palette.text.dark }),
						}}
						onClick={() => navigate(tab === "login" ? "/login" : "/register")}
					>
						{t(`${tab}_main_title`)}
					</Button>
				</Grid>
			))}
		</Grid>
	);
}
