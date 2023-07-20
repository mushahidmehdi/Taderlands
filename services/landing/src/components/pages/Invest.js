import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import styled from "styled-components";

import { CDN_ROOT } from "configs";
import { map as tradingMap } from "configs/tradingNavigation";

import Config from "services/config";

import { Heading } from "styles/shared";

import ToggleUser from "./ToggleUserButon";

const Invest = ({ setUserType, userType }) => {
	const { t } = useTranslation();
	const [activeTab, setActiveTab] = useState(tradingMap[userType][0]);

	useEffect(() => {
		if (userType === 0 || userType === 1) {
			setActiveTab(tradingMap[userType][0]);
		}
	}, [userType]);

	return (
		<InvestWrapper>
			<Head>
				<ToggleUser setUserType={setUserType} />
				<HeadingWrapper>
					<Heading> {t("strategyCreators")} </Heading>
				</HeadingWrapper>
				<Navigations>
					{tradingMap[userType].map(({ name, link }, idx) => (
						<NavItem key={idx} link={link} activeTab={activeTab} onClick={() => setActiveTab({ link })}>
							{t(name)}
						</NavItem>
					))}
				</Navigations>
			</Head>

			<Body>
				<LeftBody>
					<img
						src={`${CDN_ROOT}/assets/invest_${userType}_${activeTab?.link}.png`}
						alt="Chart"
						width="853px"
					/>
				</LeftBody>
				<RightBody>
					<p>{t(`invest_${userType}_${activeTab?.link}`)}</p>
					<button
						style={{ cursor: "pointer" }}
						onClick={() => {
							const newWindow = window.open(Config.frontendRoot(), "_blank").focus();
							if (newWindow) newWindow.opener = null;
						}}
					>
						{t("getStart")}
					</button>
				</RightBody>
			</Body>
		</InvestWrapper>
	);
};

export default Invest;

const InvestWrapper = styled.section`
	/* height: 100vh; */
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const Head = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;

	> p {
		color: ${({ theme }) => theme.gray[100]};
		font-size: 1.25rem;
		font-weight: 500;
		line-height: 1.625rem;
		font-family: Comfortaa;
		padding-bottom: 25px;
		padding-top: 15px;
		text-align: center;
	}
	@media only screen and (max-width: 45rem) {
		margin-top: 0;
		max-width: 100%;
		justify-content: center;
		align-items: center;
		margin-inline-start: 0rem;

		> p {
			color: ${({ theme }) => theme.gray[100]};
			font-size: 0.75rem;
			font-family: Comfortaa;
			font-weight: 500;
			line-height: 16px;
		}
	}
`;

const Navigations = styled.nav`
	display: flex;
	justify-content: center;
	gap: 4rem;
	margin-block-start: 1rem;

	@media only screen and (max-width: 45rem) {
		gap: 1rem;
		max-width: 400%;
	}
`;

const NavItem = styled.a`
	text-decoration: none;
	color: ${({ theme, activeTab, link }) =>
		activeTab?.link === link ? `${theme.primary.default}` : `${theme.gray[200]}`};
	font-size: 1.5rem;
	font-weight: 700;
	line-height: 26.76px;
	cursor: pointer;
	@media only screen and (max-width: 45rem) {
		line-height: 15.61px;
		font-size: 0.875rem;
		flex-wrap: wrap;
	}
`;

const Body = styled.div`
	display: flex;
	max-width: 100%;
	@media only screen and (max-width: 58rem) {
		flex-wrap: wrap;
	}
`;

const LeftBody = styled.div`
	img {
		margin-top: 4rem;
	}

	@media only screen and (max-width: 45rem) {
		img {
			width: 100%;
			height: auto;
			object-fit: cover;
			display: flex;
			margin-top: 2.2rem;
			margin-left: -2.2rem;
		}
	}
`;

const RightBody = styled.div`
	display: flex;
	flex-direction: column;
	gap: 1rem;
	margin-top: 10rem;
	margin-inline-start: 6rem;

	> p {
		color: ${({ theme }) => theme.gray[100]};
		font-family: Comfortaa;
		font-size: 1.2rem;
		font-weight: 300;
		line-height: 1.625rem;
	}
	> button {
		margin-top: 1rem;
		padding: 0.9rem 2rem;
		width: 13rem;
		border: none;
		background-color: ${({ theme }) => theme.primary.default};
		color: ${({ theme }) => theme.gray.fff};
		font-family: Comfortaa;
		font-size: 0.9rem;
		font-weight: 300;
		line-height: 20px;
		border-radius: 0.5rem;
	}

	@media only screen and (max-width: 45rem) {
		margin-top: 0;
		max-width: 100%;
		justify-content: center;
		align-items: center;
		align-items: flex-start;
		margin-inline-start: 0rem;

		> p {
			color: ${({ theme }) => theme.gray[100]};
			font-size: 12px;
			font-family: Comfortaa;
			font-weight: 300;
			line-height: 18px;
			text-align: left;
		}
		> button {
			padding: 0.4rem 1rem;
			font-size: 0.85rem;
			width: 8rem;
		}
	}
`;

const HeadingWrapper = styled.div`
	margin-block: 1rem;
`;
