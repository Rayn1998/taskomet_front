import { enqueueSnackbar, closeSnackbar } from "notistack";

import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

/**
 * Function that calls the snackbar
 * @param message - the message you want to provide to the snackbar
 * @param variant - the color variant of the snackbar: success - green, error - red, info - white, warning - orange
 * @param cbs - array of callbacks that will be executed
 */
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
