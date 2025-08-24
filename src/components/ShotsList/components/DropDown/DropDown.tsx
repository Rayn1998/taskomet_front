import { FC, useState, useEffect } from "react";

import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

interface IDropDown<K extends string | number> {
	label: string;
	selected: number;
	items: Record<K, string>;
	onChange: (item: K) => void;
}

const DropDown = <K extends string | number>({
	label,
	items,
	selected,
	onChange,
}: IDropDown<K>) => {
	const [status, setStatus] = useState<number>(selected);

	const handleChange = (e: SelectChangeEvent) => {
		// setStatus(e.target.value as string);
		console.log(e.target.value);
		// onChange(e.target.value);
	};

	// useEffect(() => {
	// 	console.log(items[selected + 1]);
	// 	selected ? setStatus(items[selected + 1]) : setStatus("");
	// }, [status]);
	return (
		<Box className="drop-down" sx={{ minWidth: "10rem" }}>
			<FormControl fullWidth>
				<InputLabel className="drop-down-label">{label}</InputLabel>
				<Select
					className="drop-down-select"
					label={label}
					// onChange={handleChange}
					value={status}
					defaultValue={status}
				>
					{Object.values(items as string[]).map((value, i) => {
						return (
							<MenuItem
								key={i}
								className="drop-down-item"
								value={value}
							>
								{value}
							</MenuItem>
						);
					})}
				</Select>
			</FormControl>
		</Box>
	);
};

export default DropDown;
