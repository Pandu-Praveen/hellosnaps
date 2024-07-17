import { writable } from "svelte/store";

export interface QueueType {
	id: number;
	status: string;
	user: string;
}
export interface WorkspaceType {
	id: string;
	name: string;
	shared: boolean;
	owner: string;
	Media: MediaType[];
	Queues: QueueType[];
}

export interface MediaType {
	id: string;
	filePath: string;
	people?: string[];
	tags?: string[];
	metadata?: object;
	createdAt: Date;
	updatedAt: Date;
}

export interface uploadStatus {
	totalFiles: number;
	uploadedFiles: number,
	workspaceId: string;
	status: string;
	success: string[],
	failed: string[]
}

export const workspaceStore = writable<WorkspaceType[] | null>(null);
export const MediaStore = writable<{ [key: string]: WorkspaceType } | null>(null);
export const uploadingStatus = writable<uploadStatus | null>();
