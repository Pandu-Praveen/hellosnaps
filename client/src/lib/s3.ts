import {
	PUBLIC_CLOUDINARY_CLOUD_NAME,
	PUBLIC_CLOUDINARY_UPLOAD_PRESET,
	PUBLIC_SERVER_BASE_URL
} from "$env/static/public";
import axios from "axios";
import api from "./api";
import { slugify } from "./utils";

const generateUniqueUploadId = () => {
	return `uqid-${Date.now()}`;
};

export const uploadFile = async (
	id: string,
	name: string,
	workspace: string,
	workspaceId: string,
	files: FileList
) => {
	// const filename = `${workspace}/${file.name.split(".")[0]}`;

	// const uniqueUploadId = generateUniqueUploadId();

	const formData = new FormData();
	for (const file of files) {
		formData.append("fi", file, file.name);
	}
	formData.append("id", id);
	formData.append("workspaceId", workspaceId);
	console.log(id);
	// formData.append("cloud_name", PUBLIC_CLOUDINARY_CLOUD_NAME);
	// formData.append("upload_preset", PUBLIC_CLOUDINARY_UPLOAD_PRESET);
	// formData.append("public_id", slugify(filename));
	// for (let [key, value] of formData.entries()) {
	// 	console.log(`${key}: ${value}`);
	// }
	try {
		const response = await fetch(`http://localhost:9000/api/media/${id}/upload`, {
			body: formData,
			method: "POST"
		});
		return await response.json();
	} catch {
		return false;
	}
};
