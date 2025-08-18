import { FC, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { errorDataStore } from "@/zustand/errorDataStore";
import errorPenguine from "@/assets/images/error-penguine.gif";
import { api } from "@/utils/Api";

const Error: FC = () => {
	const navigate = useNavigate();
	const [error, setError] = useState<string>("");
	const [time, setTime] = useState<number>(30);
	const errorData = errorDataStore((state) => state.message);

	const checkConnection = useCallback(async () => {
		try {
			const result = await api.checkServerConnection();
			if (result) {
				navigate('/projects');
			}
		} catch (err) {
			//
		}
	}, [navigate]);

	useEffect(() => {
		setError(errorData);
		checkConnection();
	}, [checkConnection, errorData]);
	useEffect(() => {
		if (time === 0) {
			checkConnection();
			setTime(30);
		}
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
			<img className="error-page-gif" src={errorPenguine} alt="gif of penguine"/>
			<p>Auto try again in to connect to server in ...</p>
			<div className="error-page-loading">
				<div className="error-page-loading-circle"></div>
				<p className="error-page-loading-time">{time}</p>
			</div>
		</div>
	);
};

export default Error;
