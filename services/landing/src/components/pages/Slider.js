import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

import exchnageBar from "assests/images/exchange-bar.svg";
import { sliderConfig } from "configs/slider";

const Slider = () => {
	const [delayTwoSec, setDelayTwoSec] = useState("none");

	useEffect(() => {
		setTimeout(function () {
			setDelayTwoSec("block");
		}, 1000);
	}, []);
	return (
		<SliderWrapper delayTwoSec={delayTwoSec}>
			<ExchnageBarBg>
				<img src={exchnageBar} alt="exchange bar bg" />
				<HighwaySlider>
					<HighwayBarrier>
						<HightLane>
							{sliderConfig.map(({ logo }, idx) => (
								<HighwayCar key={idx}>
									<img src={logo} alt="logs" />
								</HighwayCar>
							))}
						</HightLane>
					</HighwayBarrier>
				</HighwaySlider>
			</ExchnageBarBg>
		</SliderWrapper>
	);
};
export default Slider;

const SliderWrapper = styled.div`
	margin-block-start: 5rem;
	margin-block-end: 5rem;
	display: flex;
	align-items: flex-end;
	transform: ${({ delayTwoSec }) => (delayTwoSec === "block" ? "translateX(0%)" : "translateX(100%)")};
	transition-duration: 1000ms;
`;

const ExchnageBarBg = styled.div`
	position: relative;
	> img {
		width: 214rem;
		max-width: 100%;
		@media only screen and (max-width: 45rem) {
			background-color: ${({ theme }) => theme.primary.default};
		}
	}
`;

const HighwaySlider = styled.div`
	display: flex;
	justify-content: center;
	width: 100%;
	position: absolute;
	top: 60%;

	@media only screen and (max-width: 45rem) {
		top: 15%;
	}

	@media only screen and (min-width: 46.2rem) and (max-width: 86.188rem) {
		top: 55%;
	}
`;

const HighwayBarrier = styled.div`
	overflow: hidden;
	position: relative;
`;

const HightLane = styled.ul`
	display: flex;
	height: 100%;
	width: calc(180px * 24);
	margin-inline-start: 1.5rem;
	overflow: hidden;
`;

const translateinfinite = keyframes`
	100% { transform:translateX(calc(-180px * 12))  }
`;

const HighwayCar = styled.li`
	flex: 1;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: transparent;
	animation: ${translateinfinite} 25s linear infinite;

	@media only screen and (max-width: 45rem) {
		flex: 0.1;
	}
`;
