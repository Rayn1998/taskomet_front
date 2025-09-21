import { FC, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { api } from "@/utils/Api";
import Button from "@mui/material/Button";

// STORES
import { useErrorDataStore } from "@/zustand/errorDataStore";
import { useArtistStore } from "@/zustand/artistStore";

// IMAGES
import ErrorIcon from "./ErrorIcon";

const ErrorComponent: FC = () => {
	const navigate = useNavigate();
	const [error, setError] = useState<string>("");
	const [time, setTime] = useState<number>(30);

	// ERROR DATA STORE
	const errorData = useErrorDataStore((state) => state.errorMessage);

	// ARTIST STORE
	const setArtists = useArtistStore((state) => state.setArtists);

	const checkConnection = useCallback(async () => {
		try {
			const result = await api.checkServerConnection();
			if (result) {
				await api
					.getArtists()
					.then((artistList) => setArtists(artistList))
					.catch((err) => console.log(err));
				navigate("/projects");
			}
		} catch (err) {
			console.log(err);
		}
	}, [navigate]);

	function tryNowClick() {
		checkConnection();
		setTime(30);
	}

	useEffect(() => {
		if (time === 0) {
			checkConnection();
			setTime(30);
		}
		setError(errorData);
	}, [checkConnection, time]);

	useEffect(() => {
		const interval = setInterval(() => {
			setTime(time - 1);
		}, 1000);

		return () => clearInterval(interval);
	}, [time]);
	return (
		<div className="error-page">
			<div className="error-page-info">{error}</div>
			<ErrorIcon />
			<p>Auto retry to establish server connection in ...</p>
			<Button variant="contained" size="large" onClick={tryNowClick}>
				Try now
			</Button>
			<div className="error-page-loading">
				<div className="error-page-loading-circle"></div>
				<p className="error-page-loading-time">{time}</p>
			</div>
		</div>
	);
};

export default ErrorComponent;
