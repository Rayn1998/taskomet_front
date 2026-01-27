import { useSnackbar, closeSnackbar, BaseVariant } from "notistack";

// MUI
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

type SuccessCallbacks = (...args: any[]) => void;

interface SnackBarProps {
	success: boolean;
	successMessage?: string;
	errMessage?: string;
	variant: BaseVariant;
	successCBs?: SuccessCallbacks[];
}

const useSnackBar = () => {
	const { enqueueSnackbar } = useSnackbar();

	const showSnack = ({
		success,
		successMessage = "Success!",
		errMessage = "Something went wrong",
		variant = "default",
		successCBs = [],
	}: SnackBarProps) => {
		if (success) {
			const snackBarId = enqueueSnackbar(successMessage, {
				variant,
				action: (
					<IconButton onClick={() => closeSnackbar(snackBarId)}>
						<CloseIcon />
					</IconButton>
				),
			});
			successCBs.forEach((cb) => cb());
		} else {
			const snackBarId = enqueueSnackbar(errMessage, {
				variant,
				action: (
					<IconButton onClick={() => closeSnackbar(snackBarId)}>
						<CloseIcon />
					</IconButton>
				),
			});
		}
	};

	const showSnackError = (err: Error): void => {
		showSnack({
			success: false,
			variant: "error",
			errMessage: `There was an error, ${err.message}`,
		});
	};

	return { showSnack, showSnackError };
};
