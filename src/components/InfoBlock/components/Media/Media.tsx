import { useState, useEffect, MouseEvent } from "react";

// STORES
import { useArtistStore } from "@/zustand/artistStore";
import { useImagePreviewPopup } from "@/components/Popups/ImagePreview/ImagePreviewStore";
import { useCommentDataStore } from "@/zustand/commentStore";

// TYPES
import type { ISceneData, IProjectData } from "@shared/types/EntityData";

interface IMediaProps {
	data: ISceneData | IProjectData;
	relatedEntityId: number;
}

const Media = ({ data, relatedEntityId }: IMediaProps) => {
	// ARTISTS STORE
	const { getArtist } = useArtistStore();

	// IMAGE PREVIEW POPUP STORE
	const {
		setOpenClose: setImagePreviewOpenClose,
		setSrc: setImagePreviewSrc,
	} = useImagePreviewPopup();

	// COMMENT DATA STORE
	const { setCommentData } = useCommentDataStore();

	const ext = data.media?.split(".").slice(-1)[0];
	const mp4 = ext === "mp4";

	const [author, setAuthor] = useState<string>("");

	useEffect(() => {
		if (data && data.created_by) {
			const artist = getArtist(data.created_by);
			if (artist) {
				setAuthor(artist.name);
			}
		} else if (data && !data.created_by) {
			setAuthor("This artist was deleted");
		}
	}, [getArtist, setAuthor, data]);

	const handleImageClick = (e: MouseEvent<HTMLImageElement>) => {
		setImagePreviewSrc(
			`${process.env.REACT_APP_SERVER_DOMAIN}/${data.media}`,
		);
		setImagePreviewOpenClose();
	};
	return (
		<div
			className="media"
			data-type="media"
			onContextMenu={() => setCommentData(data, relatedEntityId)}
		>
			<div className="media-block">
				<div className="media-block-header">
					<div className="media-author-block">
						<div className="media-author">
							<p className="media-author-text">{author}</p>
						</div>
						<div className="media-date">{`${new Date(
							data.created_at,
						).toLocaleString()}`}</div>
					</div>
					{data.media && mp4 && (
						<video
							className="media-dailies-video"
							controls
							src={`${process.env.REACT_APP_SERVER_DOMAIN}/${data.media}`}
						/>
					)}
					{data.media && !mp4 && (
						<img
							className="media-image"
							src={`${process.env.REACT_APP_SERVER_DOMAIN}/${data.media}`}
							alt="image"
							onClick={handleImageClick}
						/>
					)}
					<div className="media-text-block">
						<div className="media-text">{data.text}</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Media;
