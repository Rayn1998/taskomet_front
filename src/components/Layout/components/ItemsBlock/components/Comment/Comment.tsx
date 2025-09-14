import { useState, useEffect } from "react";

// STORES
import { useArtistStore } from "@/zustand/artistStore";
import { useCommentStore } from "@/zustand/commentStore";

// TYPES
import ITaskData from "@shared/types/TaskData";
import {
	TypeOfDataColor,
	TypeOfDataLabels,
	TypeOfData,
} from "@/types/TypeOfData";
import { EStatus, StatusLabels, StatusColors } from "@/types/Status";

interface ITaskDataProps {
	task: ITaskData;
}

const Comment = ({ task }: ITaskDataProps) => {
	const type = task.type as TypeOfData;
	const statusLabel = StatusLabels[task.status as EStatus];
	const statusColor = StatusColors[task.status as EStatus];
	const [author, setAuthor] = useState<string>("");

	const { setCommentId: setComment } = useCommentStore();
	const getArtist = useArtistStore((state) => state.getArtist);

	useEffect(() => {
		if (task && task.created_by) {
			const artist = getArtist(task.created_by);
			if (artist) {
				setAuthor(artist.name);
			}
		}
	}, [getArtist, setAuthor, task]);

	return (
		<div
			className="comment"
			data-type="comment"
			onContextMenu={() => setComment(task.id)}
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
				<div className="comment-date-author-block">
					<div className="comment-author">{author}</div>
					<div className="comment-date">{`${new Date(
						task.created_at,
					).toLocaleString()}`}</div>
				</div>
				{type === TypeOfData.Dailies && (
					<video
						className="comment-dailies-video"
						controls
						src={`http://localhost:3001/${task.media}`}
					/>
				)}
				{type === TypeOfData.Comment && task.media && (
					<img
						className="comment-image"
						src={`http://localhost:3001/${task.media}`}
						alt="image"
					/>
				)}
				{task.text && task.text.length > 0 && (
					<div className="comment-text-block">
						<div className="comment-text">{task.text}</div>
					</div>
				)}
				{task.status !== undefined && (
					<div
						className="comment-status"
						style={{
							backgroundColor: statusColor,
						}}
					>
						{statusLabel}
					</div>
				)}
			</div>
		</div>
	);
};

export default Comment;
