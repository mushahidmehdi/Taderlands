import React from "react";
import { useTranslation } from "react-i18next";

import styled from "styled-components";

import ToggleSwitch from "./ToggleSwitch";

const Toogles = ({ cookies, setCookies }) => {
	const { t } = useTranslation();

	const cookieMap = {
		rc: t("mandatory"),
		pc: t("preference"),
		ac: t("analytics"),
	};

	return (
		<TooglesWrapper>
			{Object.keys(cookies).map((item, ix) => (
				<ToggleSwitch
					key={ix}
					name={cookieMap[item]}
					cookieType={cookies[item]}
					onChange={(event) => setCookies({ ...cookies, [item]: event.target.checked })}
					{...(item === "rc" ? { disabled: true } : {})}
				/>
			))}
		</TooglesWrapper>
	);
};

const TooglesWrapper = styled.section`
	margin-block-start: 1rem;
	margin-block-end: 1.5rem;
`;

export default Toogles;
