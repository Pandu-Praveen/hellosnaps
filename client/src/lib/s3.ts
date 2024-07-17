import { PUBLIC_CLOUDINARY_CLOUD_NAME, PUBLIC_CLOUDINARY_UPLOAD_PRESET } from "$env/static/public";


const generateUniqueUploadId = () => {
	return `uqid-${Date.now()}`;
};

export const uploadFile = async (workspace: string, file: File) => {
	const filename = `${workspace}/${file.name.split(".")[0]}`;

	const uniqueUploadId = generateUniqueUploadId();

	const formData = new FormData();
	formData.append("file", file);
	formData.append("cloud_name", PUBLIC_CLOUDINARY_CLOUD_NAME);
	formData.append("upload_preset", PUBLIC_CLOUDINARY_UPLOAD_PRESET);
	formData.append("public_id", filename);

	try {
		const response = await fetch(
			`https://api.cloudinary.com/v1_1/${PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
			{
				method: "POST",
				body: formData,
				headers: {
					"X-Unique-Upload-Id": uniqueUploadId
				}
			}
		);
		return response;
	} catch {
		return false;
	}
};
