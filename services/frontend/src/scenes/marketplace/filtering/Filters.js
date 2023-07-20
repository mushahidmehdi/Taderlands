import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Box, Button, Grid, Menu, MenuItem } from "@mui/material";

import { omit } from "lodash";

import { usePlatformApi } from "api/platform";

import queryBuilder from "utils/queryBuilder";

import { DropDown, DropDownGray, FilterSetting, FilterSettingGray, PNLup } from "images";

import { filterOptions, timeFilter } from "../config";
import SearchField from "./SearchField";
import TypeHandler from "./TypeHandler";

const Filters = ({ tab, setTab, filter }) => {
	const [active, setActive] = useState("profitPercent");

	return (
		<>
			<Grid container display="flex" justifyContent="space-between" alignItems="center" mb={4}>
				<Grid item sx={tab === "STRATEGY" ? 6 : 12}>
					<TypeHandler tab={tab} setTab={setTab} />
				</Grid>

				<Grid item sx={6}>
					<SearchField filter={filter} tab={tab} />
				</Grid>
			</Grid>
			{tab === "STRATEGY" && (
				<Grid>
					<Box display="flex" marginBottom={3} justifyContent="space-between">
						<Box display="flex" gap={1}>
							{filterOptions.right.map(({ name, type }) => (
								<RightFilterButton
									key={type}
									name={name}
									type={type}
									filter={filter}
									active={active}
									setActive={setActive}
								/>
							))}
						</Box>
						<Box display="flex" gap={1}>
							{filterOptions.left.map(({ name, type }) => (
								<LeftFilterButton key={type} name={name} type={type} filter={filter} />
							))}
						</Box>
					</Box>
				</Grid>
			)}
		</>
	);
};

const RightFilterButton = ({ name, type, active, setActive, filter }) => {
	const navigate = useNavigate();

	const handleOrderAscDesc = (e) => {
		setActive(type);
		navigate(
			`/marketplace?${queryBuilder({
				...filter?.where,
				[type]: filter?.orderBy?.[type] ? (filter?.orderBy?.[type] === "asc" ? "desc" : "asc") : "desc",
			})}`
		);
	};

	return (
		<Button
			onClick={handleOrderAscDesc}
			endIcon={
				filter?.orderBy?.[type] === "asc" ? (
					<PNLup />
				) : (
					<PNLup
						style={{
							rotate: "180deg",
						}}
					/>
				)
			}
			sx={{
				color: active !== type ? "#0F20E8" : "#fff",
				backgroundColor: active !== type ? "#fff" : "#0F20E8",

				width: "8.5rem",
				maxWidth: "100%",
				"&:hover": {
					backgroundColor: active !== type ? "#fff" : "#0F20E8",
					color: active !== type ? "#0F20E8" : "#fff",
				},
			}}
		>
			{name}
		</Button>
	);
};

const LeftFilterButton = ({ filter, type, name }) => {
	const [anchorEl, setAnchorEl] = useState(null);

	const [platforms, setPlatforms] = useState([]);

	const { timeRange, platformId } = filter?.where ?? {};

	const TIME_RANGE_TEXT_MAP = {
		"1M": "1 Month",
		"3M": "Quarterly",
		"6M": "6 Months",
		"1Y": "Yearly",
	};

	const { getPlatforms } = usePlatformApi();

	useEffect(() => {
		getPlatforms().then(({ data }) => setPlatforms(data?.platforms));
	}, []);

	const open = Boolean(anchorEl);
	const navigate = useNavigate();

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleOpen = (e) => {
		setAnchorEl(e.currentTarget);
	};

	const handleTimeRangeFilter = (val) => {
		setAnchorEl(null);

		if (val === "all") {
			navigate(
				`/marketplace?${queryBuilder(
					omit(
						{
							...filter?.where,
							...filter.orderBy,
						},
						["timeRange"]
					)
				)}`
			);
			return;
		}

		navigate(
			`/marketplace?${queryBuilder({
				...filter?.where,
				...filter.orderBy,
				timeRange: val,
			})}`
		);
	};

	const handlePlatform = (id) => {
		if (id === "all") {
			navigate(
				`/marketplace?${queryBuilder(
					omit(
						{
							...filter?.where,
							...filter.orderBy,
						},
						["platformId"]
					)
				)}`
			);
			return;
		}
		navigate(
			`/marketplace?${queryBuilder({
				...filter?.where,
				...filter.orderBy,
				platformId: id,
			})}`
		);
		setAnchorEl(null);
	};

	return (
		<>
			<Button
				endIcon={
					(type === "WEEK" && timeRange) || (type === "EXCHANGE" && platformId) ? (
						<DropDown />
					) : (
						<DropDownGray />
					)
				}
				startIcon={
					(type === "WEEK" && timeRange) || (type === "EXCHANGE" && platformId) ? (
						<FilterSetting />
					) : (
						<FilterSettingGray />
					)
				}
				onClick={handleOpen}
				name={type}
				sx={{
					color: (type === "WEEK" && timeRange) || (type === "EXCHANGE" && platformId) ? "#fff" : "#AEAEAE",
					backgroundColor:
						(type === "WEEK" && timeRange) || (type === "EXCHANGE" && platformId) ? "#0F20E8" : "#fff",
					paddingInline: "0.1rem",
					width: "10.5rem",
					"&:hover": {
						backgroundColor:
							(type === "WEEK" && timeRange) || (type === "EXCHANGE" && platformId) ? "#0F20E8" : "#fff",
						color:
							(type === "WEEK" && timeRange) || (type === "EXCHANGE" && platformId) ? "#fff" : "#0F20E8",
					},
				}}
			>
				{timeRange && type === "WEEK"
					? TIME_RANGE_TEXT_MAP[timeRange]
					: platformId && type === "EXCHANGE"
					? platforms?.filter(({ id }) => id == platformId)?.map(({ name }) => name)
					: name}
			</Button>
			<Menu
				id="basic-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				MenuListProps={{
					"aria-labelledby": "basic-button",
				}}
			>
				{type === "WEEK" &&
					timeFilter.map(({ name, value }) => (
						<MenuItem
							onClick={() => handleTimeRangeFilter(value)}
							key={value}
							sx={{
								cursor: "pointer",
								fontWeight: "400",
								"&::before": {
									marginInlineEnd: "0.5rem",
									content: "' '",
									width: "6px",
									height: "6px",
									borderRadius: "50%",
									backgroundColor: "#0F20E8",
								},
							}}
						>
							{name}
						</MenuItem>
					))}
				{type === "EXCHANGE" &&
					platforms
						?.filter((data) => data.active && data?.info?.strategyBuilding)
						?.map(({ name, id }) => (
							<MenuItem
								onClick={() => handlePlatform(id)}
								key={id}
								sx={{
									cursor: "pointer",
									fontWeight: "400",
									"&::before": {
										marginInlineEnd: "0.5rem",
										content: "' '",
										width: "6px",
										height: "6px",
										borderRadius: "50%",
										backgroundColor: "#0F20E8",
									},
								}}
							>
								{name}
							</MenuItem>
						))
						.concat(
							<MenuItem
								onClick={() => handlePlatform("all")}
								key="all"
								sx={{
									cursor: "pointer",
									fontWeight: "400",
									"&::before": {
										marginInlineEnd: "0.5rem",
										content: "' '",
										width: "6px",
										height: "6px",
										borderRadius: "50%",
										backgroundColor: "#0F20E8",
									},
								}}
							>
								All
							</MenuItem>
						)}
			</Menu>
		</>
	);
};

export default Filters;
