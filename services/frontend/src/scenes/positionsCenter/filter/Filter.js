import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Circle as CircleIcon } from "@mui/icons-material";
import { Button, Grid } from "@mui/material";

import { omit } from "lodash";

import { CustomButton } from "components";

import useQuery from "utils/useQuery";

import { Filter as FilterSvg } from "images";

import FilterDialog from "./FilterDialog";

export default function Filter({ filterData, data, onTabChange, onApplyFilters }) {
	const [open, setOpen] = useState();

	const { t } = useTranslation();
	const navigate = useNavigate();
	const query = useQuery();

	return (
		<Grid container justifyContent={"space-between"}>
			<Grid item>
				<Grid container direction={"row"}>
					{["OPEN", "CLOSED", "ERROR"].map((status) => (
						<Grid key={status} item>
							<Button
								size="large"
								sx={{
									fontSize: "1.25rem",
									...(status !== data?.status ? { color: "#AEAEAE" } : {}),
								}}
								startIcon={
									status === data?.status ? <CircleIcon sx={{ width: 8, height: 8 }} /> : <></>
								}
								onClick={() =>
									onApplyFilters(
										omit(
											{ ...data, status },

											["platforms", "strategies"].filter((y) => !data?.[y]?.length)
										)
									)
								}
							>
								{t(`controlPanel.positions.filter.${status}`)}
							</Button>
						</Grid>
					))}
				</Grid>
			</Grid>

			<Grid item>
				<Grid container direction={"row"} spacing={4}>
					{false && (
						<>
							<Grid item>
								<CustomButton
									icon={<FilterSvg />}
									text={t(`controlPanel.positions.filter.Choose Date`)}
								/>
							</Grid>
							<Grid item>
								<CustomButton
									icon={<FilterSvg />}
									text={t(`controlPanel.positions.filter.Exchange Type`)}
								/>
							</Grid>
						</>
					)}

					<Grid item>
						<CustomButton
							icon={<FilterSvg />}
							text={t(`controlPanel.positions.filter.All Filter`)}
							onClick={() => setOpen(true)}
							badge={
								data
									? Object.keys(omit(data, ["pageSize", "pageNumber", "tab", "status"])).length
									: null
							}
						/>
					</Grid>
				</Grid>
			</Grid>
			{open && (
				<FilterDialog
					data={data}
					filterData={filterData}
					open={open}
					onClose={() => setOpen(false)}
					onSave={(data) => {
						onApplyFilters(
							omit(
								data,
								["platforms", "strategies"].filter((y) => !data?.[y]?.length)
							)
						);
						setOpen(false);
					}}
				/>
			)}
		</Grid>
	);
}
