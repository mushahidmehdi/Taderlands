import React, { useEffect, useState } from "react";

import chevron from "assests/icons/chevron.svg";
import i18n from "i18next";
import styled from "styled-components";

import { supportLang } from "configs/supportedLangs";

const ChooseLan = () => {
	const cookiedLang = i18n.resolvedLanguage === "en" ? supportLang[0] : supportLang[1];

	const [dropdown, setDropdown] = useState(false);
	const [defaultLn, setDefaultLn] = useState(cookiedLang);

	const handleChangeLanguage = (lang) => {
		i18n.changeLanguage(lang.code);
		setDefaultLn(lang);
		setDropdown(!dropdown);
	};

	useEffect(() => {
		if (i18n.resolvedLanguage) {
			setDefaultLn(i18n.resolvedLanguage === "en" ? supportLang[0] : supportLang[1]);
		}
	}, [i18n.resolvedLanguage]);

	return (
		<OptionWrapper>
			<DefaultValue onClick={() => setDropdown(!dropdown)}>
				<DefaultFlag src={defaultLn.flag} alt="default flag" />
				<span>{defaultLn.name}</span>
				<ToggleCevron dropdown={dropdown} src={chevron} alt="chevron" />
			</DefaultValue>
			<DropdownItems>
				{dropdown &&
					supportLang.map((item, index) => (
						<ul key={index}>
							<li onClick={() => handleChangeLanguage(item)}>
								<DefaultFlag src={item.flag} alt="flag" />
								{item.name}
							</li>
						</ul>
					))}
			</DropdownItems>
		</OptionWrapper>
	);
};

const OptionWrapper = styled.div`
	display: flex;
	flex-direction: column;
	font-size: 1rem;
	position: relative;
	cursor: pointer;
`;

const DefaultValue = styled.div`
	display: flex;
	width: 8rem;
	max-width: 100%;
	justify-content: space-between;
	> span {
		font-size: 1rem;
		font-weight: 300;
		line-height: 1.1rem;
	}
`;

const DefaultFlag = styled.img`
	width: 1.5rem;
`;

const ToggleCevron = styled.img`
	transform: ${({ dropdown }) => (dropdown ? `rotate(180deg)` : `rotate(0)`)};
	transition-duration: 0.3s;
`;

const DropdownItems = styled.div`
	position: absolute;
	background-color: ${({ theme }) => theme.bg};
	border-radius: 0.4rem;
	> ul {
		text-decoration: none;
		list-style-type: none;
		padding-block: 0.5rem;

		> li {
			cursor: pointer;
			display: flex;
			justify-content: space-around;
			width: 8rem;
			max-width: 100%;
		}
	}
`;

export default ChooseLan;
