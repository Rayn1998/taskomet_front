import { api } from "@/utils/Api";

// MUI
import Button from "@mui/material/Button";

// STORES
import { useImagePreviewPopup } from "@/components/Popups/ImagePreview/ImagePreviewStore";

const ImagePreviewPopup = () => {
	const { open: isOpen, src, setOpenClose } = useImagePreviewPopup();

	const handleDownload = () => {
		const fileName = src.split("/").slice(-2).join("/");

		fileName &&
			api
				.download(fileName)
				.then((res) => {
					return res.blob();
				})
				.then((blob) => {
					const link = document.createElement("a");
					link.href = URL.createObjectURL(blob);
					link.download = fileName;
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);

					URL.revokeObjectURL(link.href);
				});
	};

	return (
		<div
			className="image-preview-wrapper"
			style={{
				opacity: isOpen ? 1 : 0,
				pointerEvents: isOpen ? "auto" : "none",
			}}
			onClick={setOpenClose}
		>
			<img
				className="image-preview-src"
				src={src}
				alt="image-preview"
				style={{ scale: isOpen ? 1 : 0 }}
			/>
			<Button
				className="image-preview-download"
				variant="contained"
				onClick={handleDownload}
			>
				Download
			</Button>
		</div>
	);
};

export default ImagePreviewPopup;
