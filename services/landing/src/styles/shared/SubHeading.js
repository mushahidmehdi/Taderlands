import styled from "styled-components";

const SubHeading = ({ children }) => {
	return <Subheading>{children}</Subheading>;
};

const Subheading = styled.p`
	font-size: 0.75rem;
	font-family: Comfortaa;
	font-weight: 300;
	line-height: 1.125rem;
	max-width: 32rem;
	text-align: center;
	color: ${({ theme }) => theme.gray[100]};
	letter-spacing: 0em;
	display: none;

	@media only screen and (max-width: 45rem) {
		font-size: 0.75rem;
		font-weight: 300;
		line-height: 13.38px;
		display: flex;
	}
`;

export default SubHeading;
