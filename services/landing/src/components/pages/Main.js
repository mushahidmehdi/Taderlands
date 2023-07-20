import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import AppStore from "assests/images/app-store.svg";
import googlePlay from "assests/images/google-play.svg";
import bgGradient from "assests/images/main-bg-gradient.svg";
import styled from "styled-components";

import { CDN_ROOT } from "configs";

import Config from "services/config";

import { Container } from "styles/shared";

const Main = () => {
	const { t } = useTranslation();
	const [delayFiveMiliSec, setDelayFiveMiliSec] = useState("none");

	const handleNewTab = () => {
		const newWindow = window.open(Config.frontendRoot(), "_blank").focus();
		if (newWindow) newWindow.opener = null;
	};

	useEffect(() => {
		setTimeout(function () {
			setDelayFiveMiliSec("block");
		}, 500);
	}, []);

	return (
		<Container>
			<MainWrapper>
				<RightBody delayFiveMiliSec={delayFiveMiliSec}>
					<BgRadient delayFiveMiliSec={delayFiveMiliSec}>
						<img src={bgGradient} alt="Gradient" />
					</BgRadient>

					<h1>
						<span> {t("mainTitle")} </span>
					</h1>

					<p>
						<span>{t("mainSubHeading")}</span>
					</p>
					<WatchTurorialWrapper delayFiveMiliSec={delayFiveMiliSec}>
						<h3 onClick={handleNewTab}>
							<span>{t("getStart")}</span>
						</h3>
						<h6
							style={{ cursor: "pointer" }}
							onClick={() => {
								window.open("https://www.youtube.com/@traderlands", "_blank").focus();
							}}
						>
							<span>{t("watchTutorials")}</span>
						</h6>
					</WatchTurorialWrapper>
				</RightBody>
				<LeftBody>
					<video
						src={`${CDN_ROOT}/assets/video/main-page-video.mp4`}
						autoPlay
						loop
						muted
						preload
						playsinline
						poster=""
					/>
					<ActionWrapperMob>
						{/* <img src={AppStore} alt="App Store" width={135} /> */}
						<img
							src={googlePlay}
							alt="Google Play"
							width={135}
							onClick={() => "https://play.google.com/store/apps/details?id=com.traderlands.android"}
						/>
					</ActionWrapperMob>
				</LeftBody>
			</MainWrapper>
		</Container>
	);
};

const MainWrapper = styled.section`
	display: flex;
	margin-top: 7rem;
	gap: 2rem;
	width: 94rem;
	justify-content: space-between;
	max-width: 100%;
	min-width: 22rem;

	@media screen and (max-width: 48rem) {
		margin-top: 2rem;
		flex-wrap: wrap;
	}
`;

const RightBody = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	flex: 0.6;
	min-width: 22rem;
	margin-top: 3rem;
	@media screen and (max-width: 48rem) {
		flex: 1;
	}

	h1 {
		font-family: Comfortaa;
		font-size: 4rem;
		font-weight: 700;
		line-height: 79px;
		overflow: hidden;

		@media screen and (max-width: 45rem) {
			font-size: 2.5rem;
			font-weight: 700;
			line-height: 44.6px;
		}
		span {
			display: inline-block;
			transform: ${({ delayFiveMiliSec }) =>
				delayFiveMiliSec === "block" ? "translateY(0%)" : "translateY(100%)"};
			transition-duration: 1000ms;
			max-width: 38rem;
		}
	}

	p {
		margin-top: 1rem;
		font-family: Comfortaa;
		font-size: 1.25rem;
		font-weight: 500;
		line-height: 1.625rem;
		color: ${({ theme }) => theme.gray[100]};
		display: inline-block;
		overflow: hidden;
		max-width: 36rem;

		@media screen and (max-width: 45rem) {
			font-size: 0.75rem;
			font-weight: 500;
			line-height: 1.125rem;
		}

		span {
			display: inline-block;
			transform: ${({ delayFiveMiliSec }) =>
				delayFiveMiliSec === "block" ? "translateY(0%)" : "translateY(100%)"};
			transition-duration: 1000ms;
		}
	}

	h6 {
		font-family: Comfortaa;
		font-size: 18px;
		font-weight: 700;
		line-height: 20px;
		font-size: 1.25rem;
		color: ${({ theme }) => theme.primary.default};
		margin-top: 4rem;
		overflow: hidden;

		@media only screen and (max-width: 45rem) {
			margin-top: 4rem;
		}
		@media only screen and (max-width: 444px) {
			margin-top: 3.5rem;
			font-size: 0.9rem;
		}

		span {
			display: inline-block;
			transform: ${({ delayFiveMiliSec }) =>
				delayFiveMiliSec === "block" ? "translateY(0%)" : "translateY(100%)"};
			transition-duration: 1000ms;
		}
	}

	@media screen and (max-width: 38rem) {
		margin-top: 0;
	}
`;

const ActionWrapperMob = styled.div`
	padding-top: 3rem;
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: 1rem;
	@media only screen and (min-width: 45rem) {
		display: none;
	}
`;

const LeftBody = styled.div`
	display: flex;
	max-width: 100%;
	overflow: hidden;
	flex-direction: column;
	flex: 0.4;
	width: 44rem;

	> video {
		display: block;
		width: 100%;
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

const BgRadient = styled.div`
	position: absolute;
	left: 0%;
	top: 0%;
	display: ${({ delayFiveMiliSec }) => delayFiveMiliSec};
	> img {
		width: 100%;
		height: auto;
		object-fit: cover;
	}
`;

const WatchTurorialWrapper = styled.div`
	display: flex;
	gap: 1rem;
	flex-wrap: wrap-reverse;

	h3 {
		cursor: pointer;
		font-family: Comfortaa;
		font-size: 18px;
		font-weight: 400;
		line-height: 1rem;
		color: ${({ theme }) => theme.gray.fff};
		margin-top: 3rem;
		overflow: hidden;
		border-radius: 4px;
		span {
			display: inline-block;
			background-color: ${({ theme }) => theme.primary.default};
			padding: 1rem 3rem;
			transform: ${({ delayFiveMiliSec }) =>
				delayFiveMiliSec === "block" ? "translateY(0%)" : "translateY(100%)"};
			transition-duration: 1000ms;
			@media only screen and (max-width: 444px) {
				padding: 0.6rem 1.8rem;
			}
		}
		@media only screen and (max-width: 444px) {
			font-size: 0.9rem;
		}
		@media only screen and (max-width: 329px) {
			margin-top: 0;
		}
	}

	h6 {
		font-family: Comfortaa;
		font-size: 18px;
		font-weight: 400;
		line-height: 1rem;
		margin-top: 3rem;
		overflow: hidden;
		span {
			display: inline-block;
			padding: 1rem;
			transform: ${({ delayFiveMiliSec }) =>
				delayFiveMiliSec === "block" ? "translateY(0%)" : "translateY(100%)"};
			transition-duration: 1000ms;
			@media only screen and (max-width: 444px) {
				padding: 0.6rem 1.8rem;
			}
		}
		@media only screen and (max-width: 444px) {
			font-size: 0.9rem;
			margin-top: 2.8rem;

			span {
				padding: 1rem 0.9rem;
			}
		}
		@media only screen and (max-width: 329px) {
			margin-top: 1rem;
			span {
				padding: 1rem 0.9rem;
			}
		}
	}
`;

export default Main;
