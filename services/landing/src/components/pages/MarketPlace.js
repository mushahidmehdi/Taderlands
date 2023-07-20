import { useTranslation } from "react-i18next";

import startegyLogo from "assests/images/Strategy-logo.svg";
import riskManagement from "assests/images/risk-management.png";
import publishStrategymonitize from "assests/images/strategy-monitize.png";
import styled from "styled-components";

import { CDN_ROOT } from "configs";

import { Heading } from "styles/shared";

const MarketPlace = ({ userType }) => {
	const { t } = useTranslation();
	return (
		<MarketPlaceWrapper>
			{userType === 1 ? (
				<>
					<MarketPlaceHeader>
						<Heading>{t("strategyTitle")}</Heading>
					</MarketPlaceHeader>
					<PublishStrategy>
						<PublishStrategyLeft>
							<NewImageWrapper>
								<img src={publishStrategymonitize} alt="Table " />
							</NewImageWrapper>
							<p>{t("strategyP1")}</p>

							<p>{t("strategyP2")}</p>
							<StartegyLogoWrapper>
								<img src={startegyLogo} alt="Mobile" />
							</StartegyLogoWrapper>
						</PublishStrategyLeft>
						<PublishStrategyRight>
							<img src={publishStrategymonitize} alt="Table " />
						</PublishStrategyRight>
					</PublishStrategy>
				</>
			) : (
				<>
					<RiskManagementBody>
						<RiskManagementBodyRight>
							<img src={riskManagement} alt="Risk Management " />
						</RiskManagementBodyRight>

						<RiskManagement>
							<h1>{t("riskManagement")}</h1>
							<p>{t("riskManagementP1")}</p>
							<p>{t("riskManagementP2")}</p>
							<p>{t("riskManagementP3")}</p>
						</RiskManagement>
					</RiskManagementBody>

					<MarketPlaceBody>
						<MarketPlaceBodyLeft>
							<h1>{t("creditCard")}</h1>
							<p>{t("creditCardP1")}</p>
							<p>{t("creditCardP2")}</p>
						</MarketPlaceBodyLeft>
						<MarketPlaceBodyRight>
							<img src={`${CDN_ROOT}/assets/kerdi-box.png`} alt="Mobile " />
						</MarketPlaceBodyRight>
					</MarketPlaceBody>
				</>
			)}
		</MarketPlaceWrapper>
	);
};

export default MarketPlace;

const MarketPlaceWrapper = styled.div`
	max-width: 100%;
	margin-bottom: -1rem;
`;

const MarketPlaceHeader = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: 1rem;
	@media only screen and (max-width: 45rem) {
		margin-bottom: 3.5rem;
	}
`;
const MarketPlaceBody = styled.div`
	display: flex;
	justify-content: center;
	@media only screen and (max-width: 45rem) {
		display: none;
	}
`;

const RiskManagementBody = styled.div`
	display: flex;
	justify-content: center;
	@media only screen and (max-width: 45rem) {
		flex-direction: column-reverse;
		display: none;
	}
`;

const MarketPlaceBodyLeft = styled.div`
	margin-top: 5rem;
	margin-inline-end: 10rem;
	display: flex;
	flex-direction: column;
	gap: 2rem;

	> p {
		font-size: 1.25rem;
		font-weight: 300;
		line-height: 1.625rem;
		color: ${({ theme }) => theme.gray[100]};
	}

	h1 {
		color: #0f20e8;
		font-family: Comfortaa;
		font-size: 40px;
		font-weight: 700;
		line-height: 54px;
		max-width: 22rem;
	}
`;

const RiskManagement = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: 2rem;

	> p {
		font-size: 1.25rem;
		font-weight: 300;
		line-height: 1.625rem;
		color: ${({ theme }) => theme.gray[100]};
	}

	h1 {
		color: #0f20e8;
		font-size: 40px;
		font-weight: 700;
		line-height: 54px;
		text-align: start;
	}

	@media only screen and (max-width: 45rem) {
		display: flex;
		justify-content: center;
		width: 100%;
		margin-top: 4rem;

		h1 {
			text-align: center;
			color: #0f20e8;
			font-size: 1.875rem;
			font-weight: 700;
			line-height: 22.3px;
		}
		p {
			font-size: 0.875rem;
			font-weight: 300;
			line-height: 16px;
		}
	}
`;

const MarketPlaceBodyRight = styled.div`
	width: 100%;
	position: relative;
	@media only screen and (max-width: 45rem) {
		display: none;
	}
`;

const RiskManagementBodyRight = styled.div`
	display: flex;
	margin-block-start: 5rem;
	position: relative;
	width: 90rem;
	img {
		height: auto;
		width: 100%;
		object-fit: contain;
	}
	@media only screen and (max-width: 45rem) {
		width: 100%;
	}
`;

const PublishStrategy = styled.div`
	display: flex;
	margin-block-start: 5rem;
	position: relative;

	@media only screen and (max-width: 45rem) {
		flex-direction: column-reverse;
		padding-bottom: 5rem;
		margin-top: -2.5rem;
	}
`;

const PublishStrategyLeft = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	margin-top: 2rem;
	max-width: 33rem;
	@media only screen and (max-width: 45rem) {
		margin-top: -2rem;
	}

	p {
		font-size: 1.25rem;
		font-weight: 300;
		line-height: 1.625rem;
		padding-inline: 2rem;
		overflow: hidden;
		padding-block-start: 2rem;
		width: 100%;
		height: auto;
	}
	> img {
		max-width: 100%;
		margin-top: -6rem;
	}

	@media only screen and (max-width: 45rem) {
		> p {
			padding-inline: 0rem;
			font-size: 0.75rem;
			font-weight: 300;
			line-height: 1.125rem;
		}
	}
`;

const StartegyLogoWrapper = styled.div`
	margin-top: -10rem;
	margin-inline-start: -5rem;
`;

const PublishStrategyRight = styled.div`
	margin-inline-end: -8rem;
	img:nth-child(2) {
		display: none;
	}
	img {
		width: 100%;
		height: auto;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	@media only screen and (max-width: 45rem) {
		margin-inline-end: 0;

		img:nth-child(1) {
			display: none;
		}
		img:nth-child(2) {
			display: flex;
			width: 100%;
			height: auto;
			justify-content: cover;
			margin-left: 1rem;
		}
	}
`;

const NewImageWrapper = styled.div`
	display: none;
	padding-block: 1rem;
	@media only screen and (max-width: 45rem) {
		display: block;
		> img {
			width: 100%;
		}
	}
`;
