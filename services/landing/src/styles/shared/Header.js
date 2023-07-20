import styled from "styled-components";

const Heading = ({ children }) => {
	return <HeadingWrapper>{children}</HeadingWrapper>;
};

const HeadingWrapper = styled.h1`
	font-family: Comfortaa;
	font-size: 2.2rem;
	font-weight: 700;
	line-height: 3rem;
	color: ${({ theme }) => theme.primary.default};
	text-align: center;
	margin-block-start: 2rem;
	padding-inline: 1rem;
	max-width: 80rem;

	@media only screen and (max-width: 45rem) {
		line-height: 1.6rem;
	}

	@media only screen and (max-width: 45rem) {
		margin-top: 0;
		max-width: 100%;
		justify-content: center;
		font-size: 1.25rem;
		align-items: center;
		align-items: flex-start;
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

export default Heading;
