export enum ReleaseStatus {
	DRAFT = 'DRAFT',
	TESTING = 'TESTING',
	APPROVED = 'APPROVED',
	RELEASED = 'RELEASED'
}

export interface Release {
	id: number;
	name: string;
	version: string;
	status: ReleaseStatus;
}
