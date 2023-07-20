import bgBluerImg from "assests/images/bg-q.svg";
import footer from "assests/images/footer-anima.svg";
import styled from "styled-components";

const FooterBottomBanner = () => {
	return (
		<FooterBottomBannerWrapper>
			<RightFooterImage>
				<AnimaWrapper>
					<img src={footer} alt="footer" />
				</AnimaWrapper>
				<GetStartWrapper>
					<p>Learning Center</p>
					<button>Go</button>
				</GetStartWrapper>
			</RightFooterImage>
			<LeftFooterImage bgBluerImg={bgBluerImg}>
				<p>Get Social Trading Updates Keep your knowledge up-to-date</p>
				<InputWrapper>
					<input type="text" placeholder="Add email address" />
					<button>Submit</button>
				</InputWrapper>
			</LeftFooterImage>
		</FooterBottomBannerWrapper>
	);
};

const FooterBottomBannerWrapper = styled.div`
	background-color: ${({ theme }) => theme.primary.default};
	height: 11rem;
	display: flex;
	@media only screen and (max-width: 45rem) {
		flex-wrap: wrap;
	}
`;

const RightFooterImage = styled.div`
	width: 50%;
	display: flex;
	@media only screen and (max-width: 45rem) {
		width: 100%;
		height: 9rem;
	}
`;

const AnimaWrapper = styled.div`
	position: relative;
	display: flex;
	flex: 1;
	> img {
		position: absolute;
		top: -30%;
		left: 20%;
	}
	@media only screen and (max-width: 45rem) {
		> img {
			width: 9rem;
			position: absolute;
			top: -20%;
			left: 10%;
		}
	}
`;

const LeftFooterImage = styled.div`
	width: 50%;
	background-image: url(${({ bgBluerImg }) => bgBluerImg});
	color: ${({ theme }) => theme.gray.fff};
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding-inline-start: 3rem;
	p {
		font-size: 1.6rem;
		font-weight: 700;
		line-height: 28px;
		max-width: 32rem;
	}

	@media only screen and (max-width: 45rem) {
		width: 100%;
		padding-inline: 1.5rem;
		padding-block: 2rem;
		background-image: url(${({ bgBluerImg }) => bgBluerImg});
		p {
			font-size: 0.95rem;
			font-weight: 300;
			line-height: 22px;
		}
	}
`;

const InputWrapper = styled.div`
	margin-top: 0.8rem;
	display: flex;
	max-width: 100%;
	> input {
		height: 44px;
		width: 402px;
		border-radius: 8px;
		outline: none;
		border: none;
		background-color: #9fa6f6;
		font-size: 1rem;
		font-weight: 300;
		color: ${({ theme }) => theme.gray.fff};
		text-indent: 0.5rem;
		max-width: 100%;
		::placeholder {
			color: #6f79f1;
		}
		margin-inline-end: 1rem;
	}

	> button {
		border-radius: 8px;
		font-size: 0.95rem;
		font-weight: 300;
		padding: 0.6rem 1.6rem;
		outline: none;
		border: none;
		background-color: ${({ theme }) => theme.primary.default};
		color: ${({ theme }) => theme.gray.fff};
		cursor: pointer;
	}
	@media only screen and (max-width: 45rem) {
		> input {
			height: 35px;
			width: 402px;
			border-radius: 8px;
			outline: none;
			border: none;
			background-color: #9fa6f6;
			font-size: 1rem;
			font-weight: 300;
			color: ${({ theme }) => theme.gray.fff};
			text-indent: 0.5rem;
			max-width: 100%;
			margin-inline-end: 0.4rem;
		}
	}
`;

const GetStartWrapper = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	flex: 1;
	color: ${({ theme }) => theme.gray.fff};

	> p {
		font-size: 1.3rem;
		font-weight: 700;
		line-height: 28px;
		color: ${({ theme }) => theme.gray.fff};
		@media only screen and (max-width: 45rem) {
			font-size: 1rem;
			line-height: 19px;
		}
	}

	> button {
		margin-top: 1rem;
		height: 2.5rem;
		width: 9rem;
		outline: none;
		border: none;
		font-size: 1rem;
		border-radius: 8px;
		color: ${({ theme }) => theme.gray.fff};
		background-color: rgba(255, 255, 255, 0.15);
		cursor: pointer;
	}
`;

export default FooterBottomBanner;
