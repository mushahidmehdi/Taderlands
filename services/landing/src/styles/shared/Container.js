import styled from "styled-components";

const Container = ({ children }) => {
	return (
		<OutermostContainer>
			<ContainerWrapper>{children}</ContainerWrapper>
		</OutermostContainer>
	);
};

const OutermostContainer = styled.div`
	width: 100rem;
	max-width: 100%;
	display: flex;
	flex-flow: column nowrap;
	justify-content: center;
	align-items: center;
	margin: 0 auto;
	padding-inline: 3rem;
	overflow: hidden;
	@media only screen and (max-width: 45rem) {
		padding-inline: 0rem;
	}
`;

const ContainerWrapper = styled.div`
	width: 100%;
	height: auto;
	display: flex;
	flex-flow: column nowrap;
	justify-content: center;
	align-items: center;
	margin: 0 auto;
	padding-inline: 4rem;
	@media only screen and (max-width: 45rem) {
		padding-inline: 1rem;
	}
`;

export default Container;
