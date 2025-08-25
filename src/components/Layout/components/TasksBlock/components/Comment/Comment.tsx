import { useState, useEffect } from "react";
import { useArtistStore } from "@/zustand/artistStore";

import ITaskData from "@shared/types/TaskData";

interface ITaskDataProps {
	task: ITaskData;
}

const Comment = ({ task }: ITaskDataProps) => {
	const [author, setAuthor] = useState<string>("");
	const getArtist = useArtistStore((state) => state.getArtist);

	useEffect(() => {
		if (task && task.created_by) {
			const artist = getArtist(task.created_by);
			if (artist) {
				console.log(artist);
				setAuthor(artist.name);
			}
		}
	}, [getArtist, setAuthor, task]);

	return (
		<div className="comment">
			<div className="comment-badge">COMMENT</div>
			<div className="comment-block">
				<div className="comment-date-author-block">
					<div className="comment-author">{author}</div>
					<div className="comment-date">{`${new Date(
						task.created_at,
					).toDateString()}`}</div>
				</div>
				<div className="comment-text-block">
					<div className="comment-text">{task.text}</div>
				</div>
			</div>
		</div>
	);
};

export default Comment;
