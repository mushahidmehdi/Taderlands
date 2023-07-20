import React from "react";

import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer } from "recharts";

export default function MarketplaceStrateyChart({ data, id }) {
	const gradientOffset = (data) => {
		if (!data || data.length === 0) {
			return null;
		}

		const dataMax = Math.max(...data.map((i) => i.value));
		const dataMin = Math.min(...data.map((i) => i.value));

		if (dataMax <= 0) {
			return 0;
		}
		if (dataMin >= 0) {
			return 1;
		}
		// If max value is zero, return null
		if (dataMax === 0) {
			return null;
		}

		return dataMax / (dataMax - dataMin);
	};

	const offset = gradientOffset(data);

	return (
		<>
			{data?.length ? (
				<ResponsiveContainer width="100%" height="40%">
					<AreaChart width={500} height={100} data={data}>
						{offset !== null && (
							<>
								<defs>
									<linearGradient id={`gradient_color_${id}`} x1="0" y1="0" x2="0" y2="1">
										<stop offset={offset} stopColor="#36B37E" stopOpacity={0.1} />
										<stop offset={offset} stopColor="#DE350B" stopOpacity={0.1} />
									</linearGradient>
								</defs>

								<defs>
									<linearGradient id={`stroke_${id}`} x1="0" y1="0" x2="0" y2="1.038">
										<stop
											offset={offset}
											stopColor="#36B37E"
											stopOpacity={offset !== null ? 1 : 0}
										/>
										<stop
											offset={offset}
											stopColor="#DE350B"
											stopOpacity={offset !== null ? 1 : 0}
										/>
									</linearGradient>
								</defs>
								<ReferenceLine y={0} stroke="#F1F1F5" strokeDasharray="18, 8" strokeWidth={2} />
								<Area
									type="monotone"
									dataKey="value"
									fill={`url(#gradient_color_${id})`}
									stroke={offset !== null ? `url(#stroke_${id})` : "none"}
									strokeWidth={2}
								/>
							</>
						)}

						<CartesianGrid vertical={false} horizontal={false} />
					</AreaChart>
				</ResponsiveContainer>
			) : (
				<> </>
			)}
		</>
	);
}
