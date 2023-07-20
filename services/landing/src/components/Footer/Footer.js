import React from "react";

import FooterMainImage from "./FooterMainImage";
import FooterUpperBanner from "./FooterUpperBanner";
import MainFooter from "./MainFooter";

const Footer = ({ userType }) => {
	return (
		<>
			<FooterUpperBanner />
			<FooterMainImage userType={userType} />
			<MainFooter />
		</>
	);
};

export default Footer;
