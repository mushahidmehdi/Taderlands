import styled from 'styled-components';
import Link from 'next/link';

const FlexContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	flex-flow: column wrap;
	max-width: 800px;
	margin-top: 3rem;
`;

const StyledA = styled.a`
	margin: 0 0 1rem 0;
	font-size: 1.5rem;
`;

const StyledLink = ({ href, name }) => (
	<Link href={href} passHref legacyBehavior>
		<StyledA>{name}</StyledA>
	</Link>
);

export default function Cards() {
	return (
		<FlexContainer>
			<StyledLink href="/about" name="About Page &rarr;" />
		</FlexContainer>
	);
}
