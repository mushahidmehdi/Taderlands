import { useTranslation } from "react-i18next";

import titleIcon from "assests/icons/mob-app-title-icon.svg";
import uriIcon from "assests/icons/uri-icon.svg";
import AppStore from "assests/images/app-store.svg";
import googlePlay from "assests/images/google-play.svg";
import mobApp from "assests/images/mob-app.svg";
import styled from "styled-components";

import { CDN_ROOT } from "configs";

import Config from "services/config";

import { Heading } from "styles/shared";

export const StrategyTools = ({ userType }) => {
	const { t } = useTranslation();

	return (
		<StrategyToolsWrapper>
			{userType === 1 ? (
				<>
					<StrategyToolsHeadingWrapper>
						<HeaderWrapper>
							<Heading> {t("strategyCreatorTool")}</Heading>
						</HeaderWrapper>
					</StrategyToolsHeadingWrapper>
					<StrategyToolsBodyExpert>
						<StrategyToolsBodyRightImageWrapper>
							<video
								autoPlay
								loop
								muted
								preload
								playsinline
								poster=""
								src={`${CDN_ROOT}/assets/video/strategy-video.mp4`}
							/>
						</StrategyToolsBodyRightImageWrapper>
						<OnlyMobileView>
							<OnlyMobileText>
								<p>{t("noCodeNeededP1")}</p>
								<br />
								<p>{t("noCodeNeededP2")}</p>
								<br />
								<p>{t("noCodeNeededP3")}</p>
								<br />
								<OnlyMobileButton>
									<button>{t("getStart")}</button>
								</OnlyMobileButton>
							</OnlyMobileText>
						</OnlyMobileView>

						<StrategyToolsBodyLeft mt="8rem">
							<UriTitle>
								<img src={uriIcon} alt="strategyToolImg" />
								<p>No Code Needed</p>
							</UriTitle>
							<p>{t("noCodeNeededP1")}</p>
							<p>{t("noCodeNeededP2")}</p>
							<p>{t("noCodeNeededP3")}</p>
							<button
								style={{ cursor: "pointer" }}
								onClick={() => {
									const newWindow = window.open(Config.frontendRoot(), "_blank").focus();
									if (newWindow) newWindow.opener = null;
								}}
							>
								{t("getStart")}
							</button>
						</StrategyToolsBodyLeft>
					</StrategyToolsBodyExpert>
				</>
			) : (
				<>
					<StrategyToolsBody>
						<StrategyToolsBodyRight>
							<h3>{t("marketplace")}</h3>
							<p>{t("marketplaceP1")}</p>
							<p>{t("marketplaceP2")}</p>
							<p>{t("marketplaceP3")}</p>
						</StrategyToolsBodyRight>
						<>
							<StrategyToolsBodyLeftDesk>
								<img src={`${CDN_ROOT}/user/marketplace/lp-section3.png`} alt="Mobile App" />
							</StrategyToolsBodyLeftDesk>
						</>
					</StrategyToolsBody>
					<OnlyMobileView>
						<OnlyMobileViewLeftMob>
							{/* <img
								src={`${Config.cdnRoot()}/general/landing-page/assets/mobile_app.png`}
								alt="Mobile App"
							/> */}
						</OnlyMobileViewLeftMob>
						<OnlyMobileViewLeftDesk>
							<img src={mobApp} alt="Mobile App" />
						</OnlyMobileViewLeftDesk>

						<OnlyMobileViewRight>
							<h3>{t("mobileApp")}</h3>
							<TopParagGraph>
								<img src={titleIcon} alt="MobileIcon" />
								<p>{t("mobileAppP1")}</p>
							</TopParagGraph>
							<p>
								<br />
								{t("mobileAppP2")}
							</p>
							<p>
								<br />
								{t("mobileAppP3")}
							</p>
							<ActionWrapperMob>
								{/* <img src={AppStore} alt="App Store" width={160} /> */}
								<img src={googlePlay} alt="Google Play" width={160} />
							</ActionWrapperMob>
						</OnlyMobileViewRight>
					</OnlyMobileView>

					<StrategyToolsBodyMobile>
						<StrategyToolsBodyMarketplaceMobile>
							<h3>{t("marketplace")}</h3>
							<br />
							<p>{t("marketplaceP1")}</p>
							<p>{t("marketplaceP2")}</p>
							<p>{t("marketplaceP3")}</p>
							<OnlyMobileViewLeftMob2>
								<img src={`${CDN_ROOT}/user/marketplace/lp-section3.png`} alt="Mobile App" />
							</OnlyMobileViewLeftMob2>
						</StrategyToolsBodyMarketplaceMobile>
					</StrategyToolsBodyMobile>
				</>
			)}
		</StrategyToolsWrapper>
	);
};

const StrategyToolsWrapper = styled.section`
	width: 100%;
	position: relative;
`;

const StrategyToolsBody = styled.div`
	display: flex;
	width: 100%;
	justify-content: space-between;
	@media only screen and (max-width: 45rem) {
		flex-direction: column-reverse;
		display: none;
	}
`;
const StrategyToolsBodyMobile = styled.div`
	display: none;

	@media only screen and (max-width: 45rem) {
		margin-top: -4.5rem;
		margin-bottom: 11rem;
		display: flex;
		width: 100%;
		justify-content: space-between;
		flex-direction: column-reverse;
		p {
			font-size: 0.75rem;
			font-family: Comfortaa;
			font-weight: 300;
			line-height: 1.125rem;
		}
	}
`;

const StrategyToolsBodyExpert = styled(StrategyToolsBody)`
	margin-bottom: 5rem;

	@media only screen and (max-width: 45rem) {
		display: block;
		justify-content: center;
		align-items: center;
		margin-bottom: 3rem;
	}
`;

const StrategyToolsHeadingWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-block-start: 5rem;
	margin-block-end: 3rem;
	@media only screen and (max-width: 45rem) {
		margin-block-end: 1.8rem;
	}
`;

const StrategyToolsBodyLeft = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: 1rem;
	max-width: 33rem;

	p {
		font-family: Comfortaa;
		font-size: 1.25rem;
		font-weight: 300;
		line-height: 1.625rem;
		width: 100%;
		height: auto;
		color: ${({ theme }) => theme.gray[100]};
		letter-spacing: 0em;

		@media only screen and (max-width: 45rem) {
			display: none;
		}
	}
	button {
		margin-top: 1rem;
		padding: 0.7rem 2rem;
		width: 13rem;
		border: none;
		background-color: ${({ theme }) => theme.primary.default};
		color: ${({ theme }) => theme.gray.fff};
		font-family: Comfortaa;
		font-size: 1.1rem;
		font-weight: 300;
		line-height: 20px;
		border-radius: 0.5rem;

		@media only screen and (max-width: 45rem) {
			display: none;
		}
	}

	@media only screen and (max-width: 45rem) {
		align-items: center;
		display: block;
		padding: 0.4rem 1rem;
		font-size: 0.85rem;
		font-weight: 500;
	}
`;

const StrategyToolsBodyRightImageWrapper = styled.div`
	margin-top: 3rem;
	margin-inline-start: -6rem;

	display: flex;
	max-width: 100%;
	overflow: hidden;

	> video {
		display: block;
		width: 90%;
		height: auto;
		object-fit: cover;
	}

	@media only screen and (max-width: 45rem) {
		display: flex;
		justify-content: center;
		width: 100%;
		flex: 1;
		margin: 0 auto;
		min-width: 22rem;
	}
`;

const StrategyToolsBodyLeftDesk = styled(StrategyToolsBodyLeft)`
	> img {
		width: 100%;
	}

	@media only screen and (max-width: 45rem) {
		display: none;
	}
`;

const StrategyToolsBodyRight = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	width: 44rem;
	max-width: 100%;

	h3 {
		color: ${({ theme }) => theme.primary.default};
	}

	p {
		margin-block: 1rem;
		font-size: 1.25rem;
		font-weight: 300;
		line-height: 26px;
	}

	@media only screen and (max-width: 45rem) {
		margin-top: 5rem;
		> img {
			width: 100%;
			height: auto;
			justify-content: cover;
		}

		> p {
			font-family: Comfortaa;
			font-size: 0.95rem;
			font-weight: 500;
			line-height: 22px;
		}
	}
`;
const StrategyToolsBodyMarketplaceMobile = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	width: 44rem;
	max-width: 100%;

	h3 {
		color: ${({ theme }) => theme.primary.default};
		font-size: 1.25rem;
		text-align: center;
	}
	margin-top: 1rem;

	p {
		font-size: 1.25rem;
		line-height: 22.3px;
	}

	margin-top: 5rem;
	> img {
		width: 100%;
		height: auto;
		justify-content: cover;
	}

	> p {
		font-family: Comfortaa;
		font-size: 0.75rem;
		font-weight: 300;
		line-height: 1.125rem;
	}
`;

const UriTitle = styled.div`
	display: flex;
	align-items: center;

	p {
		font-family: Comfortaa;
		font-size: 2rem;
		font-weight: 700;
		line-height: 36px;
		margin-inline-start: 1.5rem;
		color: ${({ theme }) => theme.primary.default};
	}
	@media only screen and (max-width: 45rem) {
		display: none;
	}
`;

const OnlyMobileView = styled.div`
	display: none;
	@media only screen and (max-width: 45rem) {
		display: block;
		display: flex;
		flex-direction: column-reverse;
	}
`;

const OnlyMobileViewLeft = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;

	> button {
		margin-top: 2rem;
		padding: 0.7rem 2rem;
		width: 13rem;
		border: none;
		background-color: ${({ theme }) => theme.primary.default};
		color: ${({ theme }) => theme.gray.fff};
		font-family: Comfortaa;
		font-size: 1.1rem;
		font-weight: 700;
		line-height: 20px;
		border-radius: 0.5rem;
	}

	@media only screen and (max-width: 45rem) {
		> button {
			padding: 0.4rem 1rem;
			font-size: 0.85rem;
		}
	}
`;

const OnlyMobileViewLeftDesk = styled(OnlyMobileViewLeft)`
	margin-inline-start: -3rem;
	@media only screen and (max-width: 45rem) {
		display: none;
	}
`;
const OnlyMobileViewLeftMob = styled(OnlyMobileViewLeft)`
	display: none;

	@media only screen and (max-width: 45rem) {
		display: block;
		margin-top: 4rem;
		margin-bottom: 2rem;
		> img {
			width: 100%;
			object-fit: cover;
			height: auto;
		}
	}
`;
const OnlyMobileViewLeftMob2 = styled.div`
	display: none;
	width: 100%;
	height: 60vh;
	justify-content: center;
	padding-top: 2rem;

	@media only screen and (max-width: 45rem) {
		display: flex;
		margin-bottom: -3rem;
		> img {
			height: 43vh;
		}
	}
`;

const OnlyMobileViewRight = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	padding-top: 2rem;

	h3 {
		color: ${({ theme }) => theme.primary.default};
		font-size: 1.875rem;
	}

	@media only screen and (max-width: 45rem) {
		margin-top: 5rem;
		> img {
			width: 100%;
			height: auto;
			justify-content: cover;
		}

		> p {
			font-size: 0.75rem;
			font-family: Comfortaa;
			font-weight: 300;
			line-height: 1.125rem;
		}

		h3 {
			font-size: 1.25rem;
		}
	}
`;

const OnlyMobileButton = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;

	@media only screen and (max-width: 45rem) {
		justify-content: center;
		align-items: center;

		> button {
			align-items: center;
			justify-content: center;
			margin-top: 1rem;
			width: 13rem;
			border: none;
			background-color: ${({ theme }) => theme.primary.default};
			color: ${({ theme }) => theme.gray.fff};
			font-family: Comfortaa;
			font-weight: 300;
			line-height: 20px;
			border-radius: 0.5rem;
			padding: 0.4rem 1rem;
			font-size: 0.85rem;
		}
	}
`;
const OnlyMobileText = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;

	@media only screen and (max-width: 45rem) {
		> p {
			font-size: 0.75rem;
			font-family: Comfortaa;
			font-weight: 300;
			line-height: 1.125rem;
		}
	}
`;

const TopParagGraph = styled.div`
	margin-top: 1.3rem;
	display: flex;
	justify-content: center;
	align-items: center;

	> img {
		display: flex;
		min-width: 5rem;
		height: 4.5rem;
		padding: 1rem;
	}

	> p {
		margin-inline-start: 1rem;
	}
	@media only screen and (max-width: 45rem) {
		> p {
			font-size: 0.75rem;
			font-family: Comfortaa;
			font-weight: 300;
			line-height: 1.125rem;
		}
	}
`;

const ActionWrapperMob = styled.div`
	display: flex;
	align-items: center;
	gap: 1rem;
	margin-top: 2.5rem;

	> img {
		cursor: pointer;
	}

	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: 0.4rem;
`;

const HeaderWrapper = styled.div`
	@media only screen and (max-width: 45rem) {
		margin-top: 2rem;
	}
`;

export default StrategyTools;
