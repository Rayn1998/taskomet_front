import { useState, useEffect } from "react";

// MUI
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import NativeSelect from "@mui/material/NativeSelect";

interface IDropDown<K extends number> {
	selected: number;
	items: Record<K, string>;
	onChange: (item: K) => void;
}

const DropDown = <K extends number>({
	items,
	selected,
	onChange,
}: IDropDown<K>) => {
	const [status, setStatus] = useState<K>(selected as K);

	useEffect(() => {
		setStatus(selected as K);
	}, [selected]);
	return (
		<Box className="drop-down" sx={{ minWidth: "10rem" }}>
			<FormControl
				fullWidth
				sx={{
					"& .MuiInputBase-root": {
						margin: 0,
					},
					"& .MuiFormLabel-root": { display: "none" },
				}}
			>
				<NativeSelect
					style={{
						color: "rgb(230,230,230)",
						fontSize: "1.5rem",
					}}
					className="create-comment-type"
					value={status}
					onChange={(e) => onChange(+e.target.value as K)}
				>
					{Object.entries(items).map(([key, value]) => {
						return (
							<option
								key={key}
								value={key}
								style={{ color: "rgb(30,30,30)" }}
							>
								{value as any}
							</option>
						);
					})}
				</NativeSelect>
			</FormControl>
		</Box>
	);
};

export default DropDown;
