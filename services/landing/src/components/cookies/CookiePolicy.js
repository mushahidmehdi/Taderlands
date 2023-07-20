import React, { useEffect, useState } from "react";

import styled from "styled-components";

import { getWithExpiry } from "services/localStore";

import CookiesDialog from "./CookiesDialog";

const CookiePolicy = () => {
	const [showBanner, setShowBanner] = useState(false);

	useEffect(() => {
		if (!getWithExpiry("rc")) {
			setShowBanner(true);
		}
	}, []);

	return (
		showBanner && (
			<CookiePolicyWrapper>
				<CookiesDialog setShowBanner={setShowBanner} />
			</CookiePolicyWrapper>
		)
	);
};

export default CookiePolicy;

const CookiePolicyWrapper = styled.section`
	position: absolute;
	bottom: 1%;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	position: -webkit-sticky;
	position: sticky;
`;
