import { FC, useState, useEffect } from "react";

import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

interface IDropDown {
	label: string;
	selected: number;
	items: Array<any>;
}

const DropDown: FC<IDropDown> = ({ label, items, selected }) => {
	const [status, setStatus] = useState<string>(items[selected]);

	const handleChange = (e: SelectChangeEvent) => {
		setStatus(e.target.value as string);
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
					onChange={handleChange}
					value={status}
					defaultValue={status}
				>
					{items.map((item, i) => {
						return (
							<MenuItem
								key={i}
								className="drop-down-item"
								value={item}
							>
								{item}
							</MenuItem>
						);
					})}
				</Select>
			</FormControl>
		</Box>
	);
};

export default DropDown;
