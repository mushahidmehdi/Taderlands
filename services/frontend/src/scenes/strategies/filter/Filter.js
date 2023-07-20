import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Circle as CircleIcon } from "@mui/icons-material";
import { Button, Grid } from "@mui/material";

import useQuery from "utils/useQuery";

export default function Filter({ archivedShown }) {
	const query = useQuery();

	const { t } = useTranslation("strategies");
	const navigate = useNavigate();

	const currentTab = query.get("archived") ? "archived" : "all";
	const tabs = archivedShown ? ["all", "archived"] : ["all"];

	return (
		<Grid container>
			{tabs.map((tab) => (
				<Grid item>
					<Button
						size="large"
						sx={{
							fontSize: "1.25rem",
							...(currentTab !== tab ? { color: "#AEAEAE" } : {}),
						}}
						startIcon={currentTab === tab ? <CircleIcon sx={{ width: 8, height: 8 }} /> : <></>}
						onClick={() => navigate(tab === "all" ? "/strategies" : "/strategies?archived=true")}
					>
						{t(`filter.${tab}`)}
					</Button>
				</Grid>
			))}
		</Grid>
	);
}
