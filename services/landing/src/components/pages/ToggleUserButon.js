import { useState } from "react";
import { useTranslation } from "react-i18next";

import styled from "styled-components";

import { secondaryHeader } from "configs/secondaryHeader";

const SecondaryHeader = ({ setUserType }) => {
	const [activeButton, setActiveButton] = useState(0);
	const { t } = useTranslation();
	const handleActiveUser = (param) => {
		setUserType(param);
		setActiveButton(param);
	};

	return (
		<SecondaryHeaderWrapper>
			{secondaryHeader(t).map(({ name, name_1, tabId }) => (
				<Toggle key={tabId} tabId={tabId} activeButton={activeButton} onClick={() => handleActiveUser(tabId)}>
					<p>{name}</p>
					<p>{name_1}</p>
				</Toggle>
			))}
		</SecondaryHeaderWrapper>
	);
};
const SecondaryHeaderWrapper = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: #cfd2fa;
	border-radius: 99rem;
	margin-block-end: 1rem;
`;

const Toggle = styled.div`
	cursor: pointer;
	display: flex;
	justify-content: center;
	gap: 1rem;
	padding-inline: 1rem;
	background-color: ${({ theme, activeButton, tabId }) => (activeButton === tabId ? `${theme.primary.default}` : "")};
	border-radius: ${({ activeButton, tabId }) => (activeButton === tabId ? "18px" : "")};
	width: 15rem;
	max-width: 100%;

	> p {
		padding: 0.45rem 1.8rem;
		color: ${({ theme, activeButton, tabId }) => (activeButton === tabId ? theme.gray.fff : theme.primary.default)};
		font-size: 1rem;
		font-weight: 300;
		line-height: 18px;
		text-align: center;
	}

	> p:nth-child(2) {
		display: none;
	}

	@media only screen and (max-width: 45rem) {
		width: 10.5rem;

		> p {
			font-size: 0.875rem;
			font-weight: 700;
			line-height: 15.61px;
		}
		> p:nth-child(1) {
			display: none;
		}
		> p:nth-child(2) {
			display: flex;
		}
	}
`;

export default SecondaryHeader;
