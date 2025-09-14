import { enqueueSnackbar, closeSnackbar } from "notistack";

import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

export const snackBar = (
	message: string,
	variant: "success" | "error" | "info" | "warning" = "info",
	cbs?: ((...args: any) => void)[],
) => {
	const snackBarId = enqueueSnackbar(message, {
		variant: variant,
		action: (
			<IconButton onClick={() => closeSnackbar(snackBarId)}>
				<CloseIcon />
			</IconButton>
		),
	});
	cbs?.forEach((cb) => cb());
};
