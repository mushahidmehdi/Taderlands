import { useState } from "react";
import { useTranslation } from "react-i18next";

import shipAnchorIcon from "assests/icons/shipAnchor.svg";
import gradient from "assests/images/main-bg-gradient.svg";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

import Config from "services/config";
import { setWithExpiry } from "services/localStore";

import { Button } from "./CookiesDialog";
import Toogles from "./Toogles";

const CustomizeBox = ({ setShowBanner }) => {
	const { t } = useTranslation();
	const [cookies, setCookies] = useState({ rc: true, pc: false, ac: false });

	const handleAccept = () => {
		["rc", "pc", "ac"].forEach((key) => {
			setWithExpiry(key, uuidv4(), 24 * 60 * 60 * 1000); // ttl is 24 hours
		});

		setShowBanner(false);
	};

	const handleSaveAll = () => {
		Object.keys(cookies).forEach((key) => {
			if (cookies[key]) {
				setWithExpiry(key, uuidv4(), 24 * 60 * 60 * 1000); // ttl is 24 hours
			}
		});

		setShowBanner(false);
	};

	return (
		<CustomizeBoxWrapper>
			<GradientImageWrapper>
				<img src={gradient} alt="blue bg" />
			</GradientImageWrapper>
			<CloseIconWrapper>
				<img src={shipAnchorIcon} alt="blue bg" onClick={() => setShowBanner(false)} />
			</CloseIconWrapper>
			<h1>{t("customH")}</h1>
			<p>
				{t("customP")}
				<a target="_blank" href={`${Config.frontendRoot()}/agreements?tab=3`}>
					{t("customP2")}
					{t("customP3")}
				</a>
			</p>

			<Toogles cookies={cookies} setCookies={setCookies} />
			<ButtonGroup>
				<Button onClick={handleAccept}>{t("accept")}</Button>
				<Button border={true} onClick={handleSaveAll}>
					{t("save")}
				</Button>
			</ButtonGroup>
		</CustomizeBoxWrapper>
	);
};

export default CustomizeBox;

const CustomizeBoxWrapper = styled.div`
	width: 1124px;
	border-radius: 4px;
	background-color: #fff;
	max-width: 100%;
	padding-inline: 2rem;
	padding-block: 3rem;
	display: flex;
	flex-direction: column;
	position: relative;
	overflow: hidden;

	> h1 {
		font-family: Comfortaa;
		font-size: 32px;
		font-weight: 700;
		line-height: 36px;
		color: #3a3a3a;
		line-height: 44px;
	}

	> p {
		font-family: Comfortaa;
		font-size: 16px;
		font-weight: 300;
		line-height: 18px;
		color: #3a3a3a;
		z-index: 9999;
	}

	@media only screen and (max-width: 45rem) {
		width: 96%;
	}
`;

const ButtonGroup = styled.div`
	display: flex;
	justify-content: center;
	gap: 1rem;
`;

const GradientImageWrapper = styled.div`
	position: absolute;
	left: 0;
	top: -50%;
`;

const CloseIconWrapper = styled.div`
	cursor: pointer;
	position: absolute;
	right: 1%;
	top: 2%;
`;
