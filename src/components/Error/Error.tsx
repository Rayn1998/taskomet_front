import { FC, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { errorDataStore } from "@/zustand/errorDataStore";
import { api } from "@/utils/Api";
import Button from "@mui/material/Button";

import errorPenguine from "@/assets/images/error-penguine.gif";

const Error: FC = () => {
	const navigate = useNavigate();
	const [error, setError] = useState<string>("");
	const [time, setTime] = useState<number>(30);
	const errorData = errorDataStore((state) => state.message);

	const checkConnection = useCallback(async () => {
		try {
			const result = await api.checkServerConnection();
			if (result) {
				navigate("/projects");
			}
		} catch (err) {
			//
		}
	}, [navigate]);

	function tryNowClick() {
		checkConnection();
		setTime(30);
	}

	// useEffect(() => {
	// 	checkConnection();
	// }, [checkConnection, errorData]);

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
			<img
				className="error-page-gif"
				src={errorPenguine}
				alt="gif of penguine"
			/>
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

export default Error;
