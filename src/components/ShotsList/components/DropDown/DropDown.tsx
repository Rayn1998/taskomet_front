import { useState, useEffect } from "react";

import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

interface IDropDown<K extends number> {
	label: string;
	selected: number;
	items: Record<K, string>;
	onChange: (item: K) => void;
}

const DropDown = <K extends number>({
	label,
	items,
	selected,
	onChange,
}: IDropDown<K>) => {
	const [status, setStatus] = useState<K>(selected as K);

	const handleChange = (e: SelectChangeEvent<K>) => {
		const value = Number(e.target.value);
		onChange(value as K);
	};

	useEffect(() => {
		setStatus(selected as K);
	}, [selected]);
	return (
		<Box className="drop-down" sx={{ minWidth: "10rem" }}>
			<FormControl fullWidth>
				<InputLabel className="drop-down-label">{label}</InputLabel>
				<Select
					className="drop-down-select"
					label={label}
					onChange={handleChange}
					value={status}
				>
					{Object.entries(items).map(([key, value]) => {
						return (
							<MenuItem
								key={key}
								className="drop-down-item"
								value={key}
							>
								{value as K}
							</MenuItem>
						);
					})}
				</Select>
			</FormControl>
		</Box>
	);
};

export default DropDown;
