import { Chip } from "components";

import { SIDE_LOOKUP } from "../Constants";

const Side = ({ label }) => (
	<Chip icon={SIDE_LOOKUP?.[label]?.icon} backgroundColor={SIDE_LOOKUP?.[label]?.backgroundColor} label={label} />
);

export default Side;
