import { useTranslation } from "react-i18next";

import styled from "styled-components";

import { CDN_ROOT } from "configs";

const FooterMainImage = ({ userType }) => {
	const { t } = useTranslation();

	return (
		<FooterMainImageWrapper
			bgImg={userType === 1 ? `${CDN_ROOT}/assets/into-sun-man.png` : `${CDN_ROOT}/assets/into-the-sun.png`}
			bgImgMob={
				userType === 1
					? `${CDN_ROOT}/assets/community_mobile_1.png`
					: `${CDN_ROOT}/assets/community_mobile_2.png`
			}
		>
			{userType === 1 ? (
				<>
					<h5>{t("socialTradingCommunity")}</h5>
					<p>{t("socialTradingCommunityP1")}</p>
				</>
			) : (
				<FooterParagph>
					<h5>{t("tradingCommunity")}</h5>
					<p>{t("tradingCommunityP1")}</p>
				</FooterParagph>
			)}
		</FooterMainImageWrapper>
	);
};

export default FooterMainImage;

const FooterMainImageWrapper = styled.div`
	background-image: url(${({ bgImg }) => bgImg});
	background-size: cover;
	background-repeat: no-repeat;
	background-position: center;

	color: ${({ theme }) => theme.gray.fff};
	height: 53rem;
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding-inline: 5rem;
	> h5 {
		font-size: 2.3rem;
		font-weight: 700;
		line-height: 45px;
		max-width: 32rem;
		margin-block-end: 5rem;
	}

	> p {
		font-size: 1.25rem;
		font-weight: 300;
		line-height: 1.625rem;
		max-width: 20rem;
	}

	@media only screen and (max-width: 45rem) {
		background-image: url(${({ bgImgMob }) => bgImgMob});
		background-size: cover;
		background-repeat: no-repeat;
		background-position: center;
		height: 37.5rem;

		padding-inline: 1rem;
		h5 {
			font-size: 1.25rem;
			font-weight: 700;
			line-height: 35px;
			max-width: 22rem;
			margin-block-end: 1rem;
		}
		p {
			font-size: 0.75rem;
			font-weight: 300;
			line-height: 22px;
			max-width: 22rem;
		}
	}
`;

const FooterParagph = styled.div`
	display: flex;
	flex-direction: column;
	max-width: 32rem;
	> h5 {
		margin-bottom: 1rem;
		@media only screen and (max-width: 45rem) {
			line-height: 1.4rem;
		}
	}

	> p {
		@media only screen and (max-width: 45rem) {
			line-height: 1rem;
		}
	}
`;
