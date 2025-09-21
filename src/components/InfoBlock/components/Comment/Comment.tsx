import { useState, useEffect, MouseEvent } from "react";

// STORES
import { useArtistStore } from "@/zustand/artistStore";
import { useCommentDataStore } from "@/zustand/commentStore";
import { useImagePreviewPopup } from "@/components/Popups/ImagePreview/ImagePreviewStore";

// TYPES
import type ITask from "@shared/types/Task";
import type ITaskData from "@shared/types/TaskData";
import {
	TypeOfDataColor,
	TypeOfDataLabels,
	TypeOfData,
} from "@/types/TypeOfData";
import { EStatus, StatusLabels, StatusColors } from "@/types/Status";

interface ITaskDataProps {
	taskData: ITaskData;
	relatedTaskId: number;
	statusChanged: boolean;
}

const Comment = ({
	taskData,
	relatedTaskId,
	statusChanged,
}: ITaskDataProps) => {
	const type = taskData.type as TypeOfData;
	const statusLabel = StatusLabels[taskData.status as EStatus];
	const statusColor = StatusColors[taskData.status as EStatus];
	const [author, setAuthor] = useState<string>("");
	const ext = taskData.media?.split(".").slice(-1)[0];
	const mp4 = ext === "mp4";

	const {
		setOpenClose: setImagePreviewOpenClose,
		setSrc: setImagePreviewSrc,
	} = useImagePreviewPopup();
	const { setCommentData } = useCommentDataStore();
	const getArtist = useArtistStore((state) => state.getArtist);

	const handleImageClick = (e: MouseEvent<HTMLImageElement>) => {
		setImagePreviewSrc(`http://localhost:3001/${taskData.media}`);
		setImagePreviewOpenClose();
	};

	useEffect(() => {
		if (taskData && taskData.created_by) {
			const artist = getArtist(taskData.created_by);
			if (artist) {
				setAuthor(artist.name);
			}
		}
	}, [getArtist, setAuthor, taskData]);

	return (
		<div
			className="comment"
			data-type="comment"
			onContextMenu={() => setCommentData(taskData, relatedTaskId)}
		>
			<div
				className="comment-badge"
				style={{
					backgroundColor: TypeOfDataColor[type],
				}}
			>
				{TypeOfDataLabels[type]}
			</div>
			<div className="comment-block">
				<div className="comment-block-header">
					{ext && <div className="comment-block-ext">{ext}</div>}
					{Number(taskData.spent_hours) !== 0 && (
						<div className="comment-spent-hours">
							{Number(taskData.spent_hours) + "h"}
						</div>
					)}
					<div className="comment-date-author-block">
						<div className="comment-author">{author}</div>
						<div className="comment-date">{`${new Date(
							taskData.created_at,
						).toLocaleString()}`}</div>
					</div>
				</div>

				{type === TypeOfData.SettingTheTask &&
					taskData.media &&
					mp4 && (
						<video
							className="comment-dailies-video"
							controls
							src={`http://localhost:3001/${taskData.media}`}
						/>
					)}
				{type === TypeOfData.SettingTheTask &&
					taskData.media &&
					!mp4 && (
						<img
							className="comment-image"
							src={`http://localhost:3001/${taskData.media}`}
							alt="image"
							onClick={handleImageClick}
						/>
					)}
				{type === TypeOfData.Dailies && taskData.media && mp4 && (
					<video
						className="comment-dailies-video"
						controls
						src={`http://localhost:3001/${taskData.media}`}
					/>
				)}
				{type === TypeOfData.Dailies && taskData.media && !mp4 && (
					<img
						className="comment-image"
						src={`http://localhost:3001/${taskData.media}`}
						alt="image"
						onClick={handleImageClick}
					/>
				)}
				{type === TypeOfData.Comment && taskData.media && mp4 && (
					<video
						className="comment-dailies-video"
						controls
						src={`http://localhost:3001/${taskData.media}`}
					/>
				)}
				{type === TypeOfData.Comment && taskData.media && !mp4 && (
					<img
						className="comment-image"
						src={`http://localhost:3001/${taskData.media}`}
						alt="image"
						onClick={handleImageClick}
					/>
				)}
				{taskData.text && taskData.text.length > 0 && (
					<div className="comment-text-block">
						<div className="comment-text">{taskData.text}</div>
					</div>
				)}
				{statusChanged && taskData.status !== undefined && (
					<div
						className="comment-status"
						style={{
							backgroundColor: statusColor,
						}}
					>
						Status changed to {">>"} {statusLabel}
					</div>
				)}
			</div>
		</div>
	);
};

export default Comment;
