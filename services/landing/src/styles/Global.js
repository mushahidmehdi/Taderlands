import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
	*,
	*::before,
	*::after {
		padding: 0;
		margin: 0;
		box-sizing: border-box;
	}
	html {
		font-family: 'Comfortaa', sans-serif;
		background-color: ${({ theme }) => theme.bg}

	}
	body {
		font-family: 'Comfortaa', sans-serif;
		scroll-behavior: smooth;
		background-color: ${({ theme }) => theme.bg}
	}

	
	@media only screen and (max-width: 26.499em) {
		h1 {
			font-size: 2.25rem;
			line-height: 2.35rem;
		}
		h2 {
			font-size: 2rem;
			line-height: 2.24rem;
		}
		h3 {
			font-size: 1.75rem;
			line-height: 1.92rem;
		}
		h4 {
			font-size: 1.5rem;
			line-height: 1.88;
		}
		h5 {
			font-size: 1.3125rem;
			line-height: 1.6875rem;
		}

		p {
			font-size: 1rem;
			line-height: 1.5rem;
		}
	}
	@media only screen and (min-width: 26.5em) and (max-width: 45.749em) {
		h1 {
  	  		font-size: 3.2425rem;
  	 	 	line-height: 4.2125rem;
		}
		h2 {
			font-size: 2.59rem;
			line-height: 3.45rem;
		}
		h3 {
			font-size: 2.705rem;
			line-height: 2.76rem;
		}
		h4 {
			font-size: 1.625rem;
			line-height: 2.18rem;
		}
		h5 {
			font-size: 1.3438rem;
			line-height: 1.75rem;
		}
		p {
			font-size: 1.0625rem;
			line-height: 1.59rem;
			}
		}
	@media only screen and (min-width: 45.75em) and (max-width: 63.99999em) {
		h1 {
			font-size: 3.25rem;
			line-height: 4.31rem;
		}
		h2 {
			font-size: 2.5938rem;
			line-height: 3.45rem;
		}
		h3 {
			font-size: 2.0752rem;
			line-height: 2.7625rem;
		}
		h4 {
			font-size: 1.625rem;
			line-height: 2.18rem;
		}
		h5 {
			font-size: 1.3438rem;
			line-height: 1.75rem;
		}
		p {
			font-size: 1.0625rem;
			line-height:1.5938rem;
		}

	}
	@media only screen and (min-width: 64em){
		h1 {
			font-size: 4.05rem;
			line-height: 5.4rem;
		}
		h2 {
			font-size: 3.25rem;
			line-height: 4.312rem;
		}
		h3 {
			font-size: 2.593rem;
			line-height: 3.45rem;
		}
		h4 {
			font-size: 1.2875rem;
			line-height: 1.71rem;
		}
		h5 {
			font-size: 1.625rem;
			line-height: 2.2062rem;
		}
		p {
			font-size: 1.0625rem;
			line-height: 1.59rem;
		}
	}
	`;

export default GlobalStyle;
