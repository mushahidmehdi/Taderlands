import { Box, TableCell, TableHead, TableRow, TableSortLabel } from "@mui/material";
import { visuallyHidden } from "@mui/utils";

export default function CustomTableHead({ expand, headCells, order = {}, onOrderChange }) {
	const orderBy = Object.keys(order)[0];
	return (
		<TableHead sx={{ borderRadius: 4, border: "none", backgroundColor: "#F0F0F5" }}>
			<TableRow>
				{headCells.map((headCell) => (
					<>
						{headCell.orderActive ? (
							<>
								<TableCell key={headCell.id} sortDirection={order[headCell.id] ?? false}>
									<TableSortLabel
										active={orderBy === headCell.id}
										direction={orderBy === headCell.id ? order[headCell.id] : "asc"}
										onClick={() =>
											onOrderChange({
												orderBy: headCell.id,
												orderDirection: order[headCell.id] === "desc" ? "asc" : "desc",
											})
										}
									>
										{headCell.label}
										{orderBy === headCell.id ? (
											<Box component="span" sx={visuallyHidden}>
												{order[headCell.id] === "desc"
													? "sorted descending"
													: "sorted ascending"}
											</Box>
										) : null}
									</TableSortLabel>
								</TableCell>
							</>
						) : (
							<TableCell key={headCell.id}> {headCell.label} </TableCell>
						)}
					</>
				))}
				{expand && <TableCell />}
			</TableRow>
		</TableHead>
	);
}
