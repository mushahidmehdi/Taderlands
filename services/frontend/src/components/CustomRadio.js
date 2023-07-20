import React from "react";

import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";

export default function CustomRadio({ label, value, radioGroupProps, options, onChange }) {
	return (
		<FormControl>
			{label && <FormLabel>{label}</FormLabel>}
			<RadioGroup value={value} onChange={onChange} {...radioGroupProps}>
				{options.map(({ value, label }) => (
					<FormControlLabel value={value} label={label} control={<Radio />} />
				))}
			</RadioGroup>
		</FormControl>
	);
}
