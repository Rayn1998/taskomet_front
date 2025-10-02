import { useState, useEffect } from "react";

// MUI
import KeyboardDoubleArrowDownOutlinedIcon from "@mui/icons-material/KeyboardDoubleArrowDownOutlined";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";

// NIVO
import { ResponsivePie } from "@nivo/pie";

// STORES
import { useTasksStore } from "@/zustand/tasksStore";

// TYPES
import { EStatus, StatusLabels, StatusColors } from "@/types/Status";

const StatisticBlock = () => {
	// TASKS STORE
	const { tasks } = useTasksStore();

	const [pieData, setPieData] = useState<{ id: string; value: number }[]>([]);
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [isShowStatisticsIcon, setIsShowStatisticsIcon] =
		useState<boolean>(true);

	// Логика отображения стрелки для открытия блока статистики
	useEffect(() => {
		if (!isOpen) {
			setTimeout(() => {
				setIsShowStatisticsIcon(true);
			}, 250);
		} else {
			setIsShowStatisticsIcon(false);
		}
	}, [isOpen]);

	const [numberOfTasks, setNumberOfTasks] = useState<number>(0);
	const [spentHours, setSpentHours] = useState<number>(0);

	useEffect(() => {
		if (tasks && isOpen) {
			let hours = 0;
			const data = new Map();
			const resData = [] as any;

			for (const task of tasks) {
				const taskStatus = task.status as EStatus;
				if (data.has(taskStatus)) {
					const value = data.get(taskStatus);
					value[0]++;
					data.set(taskStatus, value);
				} else {
					data.set(taskStatus, [1, StatusColors[taskStatus]]);
				}
				hours += Number(task.spent_hours);
			}

			for (const [status, values] of data.entries()) {
				const statusData = {
					id: StatusLabels[status as EStatus],
					value: values[0],
					color: values[1],
				};
				resData.push(statusData);
			}

			setPieData(resData);
			setNumberOfTasks(tasks.length);
			setSpentHours(hours);
		}
	}, [tasks, isOpen]);
	return (
		<>
			<div
				className="statistic-block"
				style={{
					height: isOpen ? "100%" : "5%",
					cursor: !isOpen ? "pointer" : "auto",
				}}
				onClick={() => {
					!isOpen && setIsOpen(true);
				}}
			>
				{!isOpen && (
					<KeyboardDoubleArrowUpIcon
						className="statistic-block__show-icon"
						fontSize="large"
						style={{
							opacity: isShowStatisticsIcon ? 1 : 0,
						}}
						onClick={() => setIsOpen(true)}
					/>
				)}
				<div
					className="statistic-block-content"
					style={{
						opacity: isOpen ? 1 : 0,
						transform: isOpen
							? "translateY(0)"
							: "translateY(10rem)",
					}}
				>
					<KeyboardDoubleArrowDownOutlinedIcon
						className="statistic-block__close-icon"
						fontSize="large"
						onClick={() => setIsOpen(false)}
					/>
					<div className="statistic-block__left-block">
						<div className="statistic-block__left-block-item">
							<p className="statistic-block__left-block-hours">
								Number of tasks:
							</p>
							<p className="statistic-block__left-block-hours_value">
								{numberOfTasks}
							</p>
						</div>
						<div className="statistic-block__left-block-item">
							<p className="statistic-block__left-block-hours">
								Spent Hours:
							</p>
							<p className="statistic-block__left-block-hours_value">
								{spentHours}
							</p>
						</div>
					</div>
					<div className="statistic-block__pie-block">
						<ResponsivePie
							data={pieData}
							margin={{
								top: 20,
								right: 40,
								bottom: 20,
								left: 100,
							}}
							theme={{
								tooltip: {
									container: {
										backgroundColor: "black",
									},
								},
							}}
							colors={{ datum: "data.color" }}
							innerRadius={0.1}
							padAngle={0.5}
							cornerRadius={5}
							activeOuterRadiusOffset={10}
							arcLinkLabelsSkipAngle={0}
							arcLinkLabelsTextColor={"#fff"}
							arcLinkLabelsTextOffset={-20}
							arcLabelsTextColor={"#fff"}
						/>
					</div>
				</div>
			</div>
		</>
	);
};

export default StatisticBlock;
