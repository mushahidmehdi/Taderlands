import { useTranslation } from "react-i18next";

import blueBanner from "assests/images/blue-banner.svg";
import styled from "styled-components";

import Config from "services/config";

const TopFooter = () => {
	const { t } = useTranslation();

	return (
		<FooterUpperBanner banner={blueBanner}>
			<h3>Automate, Manage and Monitor Your Portfolio</h3>
			<ButtonWrapper>
				<Button
					onClick={() => {
						const newWindow = window.open(Config.frontendRoot(), "_blank").focus();
						if (newWindow) newWindow.opener = null;
					}}
				>
					{t("getStart")}
				</Button>
			</ButtonWrapper>
		</FooterUpperBanner>
	);
};

export default TopFooter;

const FooterUpperBanner = styled.div`
	background-image: url(${({ banner }) => banner});
	height: 10rem;
	display: flex;
	justify-content: space-between;
	padding-inline: 5rem;
	margin-top: 7rem;

	> h3 {
		color: ${({ theme }) => theme.gray.fff};
		max-width: 33rem;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	@media only screen and (max-width: 45rem) {
		padding-inline: 1rem;
		margin-top: -9rem;

		> h3 {
			color: ${({ theme }) => theme.gray.fff};
			display: flex;
			font-size: 1.2rem;
			line-height: 1.2rem;
		}
	}
`;

const ButtonWrapper = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
`;

const Button = styled.button`
	padding: 0.7rem 2rem;
	width: 13rem;
	border: none;
	background-color: ${({ theme }) => theme.secondary.default};
	color: ${({ theme }) => theme.gray.fff};
	font-family: Comfortaa;
	font-size: 1.1rem;
	font-weight: 700;
	line-height: 20px;
	border-radius: 0.5rem;
	cursor: pointer;

	@media only screen and (max-width: 45rem) {
		padding: 0.5rem 0.1rem;
		width: 8rem;
		border-radius: 0.3rem;
		font-size: 0.9rem;
	}
`;
