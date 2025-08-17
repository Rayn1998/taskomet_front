import { FC, useState, useEffect } from "react";

import { errorDataStore } from "@/zustand/errorDataStore";
import errorPenguine from "@/assets/images/error-penguine.gif";

const Error: FC = () => {
	const [error, setError] = useState<string>("");
	const errorData = errorDataStore((state) => state.message);
	useEffect(() => {
		setError(errorData);
	}, [errorData]);
	return (
		<div className="error-page">
			<div className="error-page-info">{error}</div>
			<img className="error-page-gif" src={errorPenguine} />
		</div>
	);
};

export default Error;
