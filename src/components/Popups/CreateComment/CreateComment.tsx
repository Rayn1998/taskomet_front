import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

import { api } from "@/utils/Api";

// MUI
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import Button from "@mui/material/Button";
import NativeSelect from "@mui/material/NativeSelect";
import DeleteIcon from "@mui/icons-material/Delete";

// STORES
import { useCreateCommentPopupStore } from "./CreateCommentPopupStore";

const CreateComment = () => {
	const onDrop = useCallback((acceptedFiles: File[]) => {
		const file = new FileReader();

		file.onload = () => {
			if (acceptedFiles[0].type.startsWith("image"))
				setImagePreview(file.result);
			if (acceptedFiles[0].type.startsWith("video"))
				setVideoPreview(file.result);
		};

		file.readAsDataURL(acceptedFiles[0]);
	}, []);
	const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
		useDropzone({
			onDrop,
		});
	const [videoPreview, setVideoPreview] = useState<
		string | ArrayBuffer | null
	>(null);
	const [imagePreview, setImagePreview] = useState<
		string | ArrayBuffer | null
	>(null);
	const { isOpen, setClose: setPopupClose } = useCreateCommentPopupStore();

	const handleClose = () => {
		setImagePreview(null);
		setVideoPreview(null);
		setPopupClose();
	};

	const handleSubmit = async (e: React.SyntheticEvent) => {
		e.preventDefault();

		if (typeof acceptedFiles[0] === "undefined") return;

		const formData = new FormData();

		formData.append("image", acceptedFiles[0]);

		await api
			.sendFile(formData)
			.then((_) => {
				setPopupClose();
				setImagePreview(null);
			})
			.catch((err) => console.log(err));
	};

	return (
		<Dialog open={isOpen} className="create-comment-popup">
			<DialogTitle>Add new comment</DialogTitle>
			<DialogContent
				className="create-comment-content"
				sx={{
					display: "flex",
					flexDirection: "column",
					width: "60rem",
					gap: "1rem",
				}}
			>
				{/* <TextField label="name" /> */}
				<TextareaAutosize
					// onDrag={() => setDrag(false)}
					// onDragOver={() => setDrag(true)}
					minRows={10}
					style={{
						minWidth: "100%",
						maxWidth: "100%",
						padding: "0.5rem",
						position: "relative",
					}}
				/>
				{/* <div
					className="on-drag-hover"
					style={{
						position: "absolute",
						width: "100%",
						height: "100%",
						// backgroundColor: "red",
						top: 0,
						left: 0,
						// display: drag ? "block" : "none",
						borderRadius: 0,
					}}
				></div> */}
				{!imagePreview && !videoPreview && (
					<div
						className="create-comment-input-section"
						{...getRootProps()}
						style={{
							backgroundColor: isDragActive
								? "rgba(0,0,0,0.3)"
								: "transparent",
						}}
					>
						<input {...getInputProps()} />
						{isDragActive ? (
							<p>Drop files here ...</p>
						) : (
							<p>
								Drag 'n' drop files here, or click to select
								files
							</p>
						)}
					</div>
				)}
				{(imagePreview || videoPreview) && (
					<DeleteIcon
						className="delete-icon"
						sx={{
							width: "3rem",
							height: "3rem",
							color: "rgb(200,0,0)",
							cursor: "pointer",
						}}
						onClick={() => {
							setImagePreview(null);
							setVideoPreview(null);
						}}
					/>
				)}
				{imagePreview && (
					<img
						className="create-comment-preview"
						src={imagePreview as string}
					/>
				)}
				{videoPreview && (
					<video src={videoPreview as string} controls />
				)}
			</DialogContent>
			<DialogActions>
				<NativeSelect>
					<option>0h</option>
					<option>0.5h</option>
					<option>1h</option>
					<option>1.5h</option>
					<option>2h</option>
					<option>2.5h</option>
					<option>3h</option>
					<option>3.5h</option>
					<option>4h</option>
					<option>4.5h</option>
					<option>5h</option>
					<option>5.5h</option>
					<option>6h</option>
					<option>6.5h</option>
					<option>7h</option>
					<option>7.5h</option>
					<option>8h</option>
				</NativeSelect>
				<Button
					onClick={handleSubmit}
					variant="contained"
					color="success"
				>
					send
				</Button>
				<Button variant="contained" color="error" onClick={handleClose}>
					cancel
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default CreateComment;
