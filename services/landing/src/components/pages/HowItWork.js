import { useTranslation } from "react-i18next";

import { HowItWorks } from "assests/images";
import styled from "styled-components";

import { CDN_ROOT } from "configs";

import { Heading, SubHeading } from "styles/shared";

const HowWork = () => {
	const { t, i18n } = useTranslation();

	return (
		<HowWorkWrapper>
			<Heading>{t("howitwork")}</Heading>
			<SubHeadingWrapper>
				<SubHeading>{t("howitworkP1")}</SubHeading>
			</SubHeadingWrapper>
			{i18n.resolvedLanguage === "en" ? (
				<ArrowImageWrapper>
					<HowItWorks />
				</ArrowImageWrapper>
			) : (
				<ArrowImageWrapper>
					<img src={`${CDN_ROOT}/assets/steps.png`} alt="How it Work" />
				</ArrowImageWrapper>
			)}
		</HowWorkWrapper>
	);
};

export default HowWork;

const HowWorkWrapper = styled.section`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;

	@media only screen and (max-width: 45rem) {
		margin-top: 3rem;
	}
`;

const SubHeadingWrapper = styled.div`
	display: flex;
	margin-block: 1rem;
	@media only screen and (max-width: 45rem) {
		display: none;
	}
`;

const ArrowImageWrapper = styled.div`
	display: flex;
	justify-content: center;
	width: 100%;
	@media only screen and (max-width: 45rem) {
		height: 15rem;
		margin-top: -12rem;
	}
	img {
		width: 100%;
		height: auto;
		object-fit: cover;
	}
`;
