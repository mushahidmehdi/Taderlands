import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Link } from "@mui/material";

import lockIcon from "assests/icons/lock.svg";
import shipAnchorIcon from "assests/icons/shipAnchor.svg";
import gradient from "assests/images/main-bg-gradient.svg";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

import Config from "services/config";
import { setWithExpiry } from "services/localStore";

import CustomizeBox from "./CustomizeBox";

const CookiesDialog = ({ setShowBanner }) => {
	const [customize, setCustomize] = useState(false);

	const { t } = useTranslation();

	const handleAccept = () => {
		["rc", "pc", "ac"].forEach((key) => {
			setWithExpiry(key, uuidv4(), 24 * 60 * 60 * 1000);
		});

		setShowBanner(false);
	};

	return (
		<>
			{customize ? (
				<CustomizeBox setShowBanner={setShowBanner} />
			) : (
				<CookiesDialogWrapper>
					<GradientImageWrapper>
						<img src={gradient} alt="blue bg" />
					</GradientImageWrapper>
					<CloseIconWrapper>
						<img src={shipAnchorIcon} alt="blue bg" onClick={() => setShowBanner(false)} />
					</CloseIconWrapper>

					<TextArea>
						<LockTitleWrapper>
							<img src={lockIcon} alt="lock Icon" />
							<h4>{t("cookieH")}</h4>
						</LockTitleWrapper>

						<p>
							{t("cookieP")}
							<Link target="_blank" href={`${Config.frontendRoot()}/agreements?tab=3`}>
								{t("cookieP2")}
							</Link>
							{t("cookieP3")}
						</p>
					</TextArea>
					<ButtonGroup>
						<Button onClick={handleAccept}>{t("accept")}</Button>
						<Button border={true} onClick={() => setCustomize(true)}>
							{t("settings")}
						</Button>
					</ButtonGroup>
				</CookiesDialogWrapper>
			)}
		</>
	);
};

export default CookiesDialog;

const CookiesDialogWrapper = styled.div`
	width: 81vw;
	border-radius: 4px;
	background-color: #fff;
	max-width: 100%;
	padding-inline: 2.2rem;
	padding-block: 3.4rem;
	display: flex;
	align-items: center;
	position: relative;
	overflow: hidden;
	@media only screen and (max-width: 45rem) {
		width: 96%;
		flex-direction: column;
	}
`;

const TextArea = styled.div`
	> p {
		font-size: 16px;
		font-weight: 300;
		line-height: 18px;
		color: #3a3a3a;
	}
`;
const LockTitleWrapper = styled.div`
	display: flex;
	align-items: center;
	margin-block-end: 0.8rem;
	> h4 {
		margin-inline-start: 1rem;
		color: #3a3a3a;
		font-size: 32px;
		font-weight: 700;
		line-height: 36px;
	}
`;

const ButtonGroup = styled.div`
	display: flex;
	flex-direction: column;
	gap: 1rem;

	@media only screen and (max-width: 45rem) {
		margin-top: 2rem;
	}
`;

export const Button = styled.button`
	cursor: pointer;
	width: 15rem;
	max-width: 100%;
	font-family: Comfortaa;
	font-size: 16px;
	font-weight: 300;
	color: ${({ theme, border }) => (border ? theme.primary.default : theme.gray.fff)};
	border-radius: 4px;
	outline: none;
	border: ${({ border }) => (border ? "1px solid #0F20E8" : "none")};
	background-color: ${({ theme, border }) => (border ? "transparent" : theme.primary.default)};
	padding: 1rem;
`;

const GradientImageWrapper = styled.div`
	position: absolute;
	left: 0;
	top: -10;
	@media only screen and (max-width: 45rem) {
		display: none;
	}
`;

const CloseIconWrapper = styled.div`
	cursor: pointer;
	position: absolute;
	right: 1.3%;
	top: 8%;
`;
