import React from "react";

import { Switch } from "@mui/material";

import styled from "styled-components";

const ToggleSwitch = ({ name, cookieType, onChange, ...rest }) => {
	return (
		<ToggleSwitchWrapper>
			<p>{name}</p>
			<Switch checked={cookieType} onChange={onChange} {...rest} />
		</ToggleSwitchWrapper>
	);
};

const ToggleSwitchWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	max-width: 28rem;
	margin-block: 0.7rem;

	> p {
		font-family: Comfortaa;
		font-size: 16px;
		font-weight: 700;
		line-height: 18px;
	}
`;

export default ToggleSwitch;
