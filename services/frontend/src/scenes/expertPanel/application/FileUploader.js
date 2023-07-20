import { useRef } from "react";
import { useTranslation } from "react-i18next";

import { Box, Typography } from "@mui/material";

import { useSnackbar } from "notistack";

import export_profile_upload_placehoder from "images/export_profile_upload_placehoder.jpeg";

const FileUploader = ({ error, profilePicture, setProfilePicture }) => {
	const wrapperRef = useRef(null);
	const { enqueueSnackbar } = useSnackbar();
	const { t } = useTranslation("expertPanel");

	const onDragEnter = () => wrapperRef.current.classList.add("dragOver");
	const onDragLeave = () => wrapperRef.current.classList.remove("dragOver");
	const onDrop = () => wrapperRef.current.classList.remove("dragOver");

	function checkFileType(file) {
		if (file.split("/")[1].toUpperCase() === "PNG") {
			return true;
		} else {
			enqueueSnackbar(`Only PNG files are allowed`, { variant: "error" });
			return false;
		}
	}

	const handleFileImage = (e) => {
		const file = e.target.files[0];

		if (checkFileType(file.type)) {
			setProfilePicture(file);
		}
	};

	return (
		<Box
			ref={wrapperRef}
			onDrop={onDrop}
			onDragEnter={onDragEnter}
			onDragLeave={onDragLeave}
			sx={{
				border: (theme) =>
					`1px ${error ? "solid" : "dashed"} ${
						error ? theme.palette.danger.main : theme.palette.primary.main
					}`,
				backgroundColor: "#F4F5FC",
				borderRadius: "0.5rem",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				width: "22rem",
				height: "10rem",
				position: "relative",
			}}
		>
			{profilePicture ? (
				<>
					<img
						src={URL.createObjectURL(profilePicture)}
						alt="profilePicture"
						style={{
							width: "5rem",
							height: "5rem",
							borderRadius: "99rem",
							objectFit: "cover",
						}}
					/>
					<Typography
						sx={{
							marginBlock: "1rem",
						}}
					>
						{profilePicture.name}
					</Typography>
				</>
			) : (
				<>
					<img src={export_profile_upload_placehoder} alt="Placeholder" />
					<Typography
						sx={{
							marginBlock: "1rem",
						}}
					>
						+ {t("expert_application_form_pp_title")}
					</Typography>
				</>
			)}

			<input
				type="file"
				name="file"
				onChange={handleFileImage}
				style={{
					opacity: 0,
					position: "absolute",
					top: 0,
					left: 0,
					width: "100%",
					height: "100%",
					cursor: "pointer",
					border: "1px solid red",
				}}
			/>
		</Box>
	);
};

export default FileUploader;
