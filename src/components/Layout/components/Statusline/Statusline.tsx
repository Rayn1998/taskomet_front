import { FC, useState, MouseEvent, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const Statusline: FC = () => {
	const navigate = useNavigate();
	const params = useParams();
	const [path, setPath] = useState<string[]>([]);

	const handleClick = (e: MouseEvent<HTMLSpanElement>) => {
		const targetPath: string = e.currentTarget.innerText.split(" ")[1];
		const newPath = path.slice(
			0,
			path.findIndex((el) => el === targetPath) + 1,
		);

		setPath(newPath);
		navigate(`/projects/${newPath.join("/")}`);
	};

	const handleBack = () => {
		if (path.length > 0) {
			const newPath = path.slice(0, -1);
			setPath(newPath);
			navigate(`/projects/${newPath.join("/")}`);
		}
	};

	useEffect(() => {
		const paramsValues: string[] = Object.values(params).filter(
			(val): val is string => val !== undefined,
		);
		setPath(paramsValues);
	}, []);

	return (
		<div className="statusline">
			<div
				className="statusline-back"
				style={{
					opacity: path.length === 0 ? 0.25 : 1,
					cursor: path.length === 0 ? "not-allowed" : "pointer",
				}}
				onClick={handleBack}
			></div>
			{path.map((el, i) => (
				<span className="statusline-path" key={i} onClick={handleClick}>
					{" > "}
					{el}
				</span>
			))}
		</div>
	);
};

export default Statusline;
