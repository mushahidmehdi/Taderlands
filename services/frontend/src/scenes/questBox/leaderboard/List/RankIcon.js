import React from "react";

import { Ellipse, LeaderboardArrow } from "images";

export default function RankIcon({ previousRank, rank }) {
	return (
		<div>
			{previousRank ? (
				rank === previousRank ? (
					<Ellipse style={{ marginBottom: "3px" }} />
				) : (
					<LeaderboardArrow down={rank > previousRank} style={{ marginTop: "7px" }} />
				)
			) : (
				<></>
			)}
		</div>
	);
}
