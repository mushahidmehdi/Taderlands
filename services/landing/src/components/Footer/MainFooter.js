import { useTranslation } from "react-i18next";

import { Typography } from "@mui/material";

import discord from "assests/icons/discord.svg";
import instagram from "assests/icons/insta.svg";
import nameBottomLogo from "assests/icons/logo-name-bottom.svg";
import medium from "assests/icons/medium.svg";
import newTab from "assests/icons/new-tab-arrow.svg";
import twitter from "assests/icons/tw.svg";
import youtube from "assests/icons/yt.svg";
import styled from "styled-components";

import { footer } from "configs/footer";
import useOpenInNewTab from "configs/navigations/useOpenInNewTab";

import Config from "services/config";

import ChooseLan from "utility/ChooseLan";

const BottomFooter = () => {
	const { i18n, t } = useTranslation();
	const openInNewTab = useOpenInNewTab();

	return (
		<BottomFooterWrapper>
			<LogoWrapper>
				<img src={nameBottomLogo} alt="Logo" />
			</LogoWrapper>
			<SocailMediaIconsMobile>
				<img
					src={youtube}
					alt="youtube"
					style={{ cursor: "pointer" }}
					onClick={() => {
						openInNewTab("youtube");
					}}
				/>
				<img
					src={twitter}
					alt="twitter"
					style={{ cursor: "pointer" }}
					onClick={() => {
						openInNewTab("twitter");
					}}
				/>
				<img
					src={instagram}
					alt="instagram"
					style={{ cursor: "pointer" }}
					onClick={() => {
						openInNewTab("instagram");
					}}
				/>
				<img
					src={discord}
					alt="discord"
					style={{ cursor: "pointer" }}
					onClick={() => {
						openInNewTab("discord");
					}}
				/>
				<img
					src={medium}
					alt="medium"
					style={{ cursor: "pointer" }}
					onClick={() => {
						openInNewTab("medium");
					}}
				/>
			</SocailMediaIconsMobile>
			<FotterLinks>
				{footer(t).map(({ name, link }) => (
					<div>
						<FooterLink
							href={`${Config.frontendRoot()}/agreements?tab=${link}`}
							src={link}
							target="_blank"
							rel="noreferrer"
						>
							{name}
						</FooterLink>
						<img src={newTab} alt="newTab" width={10} />
					</div>
				))}
			</FotterLinks>
			<SocailMediaIconsDesktop>
				<img
					src={youtube}
					alt="youtube"
					style={{ cursor: "pointer" }}
					onClick={() => {
						openInNewTab("youtube");
					}}
				/>
				<img
					src={twitter}
					alt="twitter"
					style={{ cursor: "pointer" }}
					onClick={() => {
						openInNewTab("twitter");
					}}
				/>
				{i18n.resolvedLanguage === "en" && (
					<img
						src={instagram}
						alt="instagram"
						style={{ cursor: "pointer" }}
						onClick={() => {
							openInNewTab("instagram");
						}}
					/>
				)}
				<img
					src={discord}
					alt="discord"
					style={{ cursor: "pointer" }}
					onClick={() => {
						openInNewTab("discord");
					}}
				/>
				<img
					src={medium}
					alt="medium"
					style={{ cursor: "pointer" }}
					onClick={() => {
						openInNewTab("medium");
					}}
				/>
			</SocailMediaIconsDesktop>

			{/* <PlayStore>
				<img src={AppStore} alt="App Store" width={140} />
				<img src={googlePlay} alt="Google Play" width={140} />
			</PlayStore> */}

			{/* <LanguageWrapper>
				<ChooseLan />
			</LanguageWrapper> */}

			<YearWrapper>
				<Typography variant="body2" fontFamily={"Comfortaa"} color="text.secondary" align="center">
					{"© "}
					{new Date().getFullYear()} Traderlands Limited (Reg # 237048)
				</Typography>
			</YearWrapper>
		</BottomFooterWrapper>
	);
};

export default BottomFooter;

const BottomFooterWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 5rem;
	@media only screen and (max-width: 45rem) {
		margin-top: 5rem;
	}
`;
const LogoWrapper = styled.div``;

const FotterLinks = styled.div`
	display: flex;
	gap: 2rem;
	margin-top: 1rem;
	div,
	img {
		margin-top: 0.5rem;
		padding-top: 0.3rem;
		margin-inline-start: 0.3rem;
		cursor: pointer;
	}

	@media only screen and (max-width: 45rem) {
		flex-direction: column;
		gap: 0.6rem;
	}
`;

const FooterLink = styled.a`
	font-size: 1rem;
	font-weight: 300;
	line-height: 0.85rem;
	letter-spacing: 0em;
	text-align: right;
	color: #b5b5b5;
	text-decoration: none;
	target: _blank;
	rel: noreferrer;
	target-name: new;
	target-new: tab;
	@media only screen and (max-width: 45rem) {
		font-size: 0.85rem;
	}
`;

const SocailMediaIcons = styled.div`
	display: flex;
	gap: 2rem;
	margin-block: 2rem;
`;

const SocailMediaIconsDesktop = styled(SocailMediaIcons)`
	@media only screen and (max-width: 45rem) {
		display: none;
	}
`;
const SocailMediaIconsMobile = styled(SocailMediaIcons)`
	@media only screen and (min-width: 45rem) {
		display: none;
	}
`;

const LanguageWrapper = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;
	padding-block: 1.4rem;
	align-items: center;
`;

const YearWrapper = styled.div`
	margin-block: 1rem;
`;

const PlayStore = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	margin-block-end: 1rem;

	> img {
		cursor: pointer;
	}

	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: 0.8rem;

	@media only screen and (max-width: 45rem) {
		display: none;
	}
`;
