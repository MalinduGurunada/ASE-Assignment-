export type Role = 'ADMIN' | 'VIEWER';
export type ReleaseStatus = 'DRAFT' | 'TESTING' | 'APPROVED' | 'RELEASED';
export type DeploymentStatus = 'PENDING' | 'DEPLOYED' | 'FAILED' | 'ROLLED_BACK';

export interface LoginResponse {
  accessToken: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  createdAt: string;
}

export interface Release {
  id: number;
  productId: number;
  productName: string;
  version: string;
  name: string;
  status: ReleaseStatus;
  createdAt: string;
  releasedAt: string | null;
}

export interface Deployment {
  id: number;
  releaseId: number;
  releaseName: string;
  environmentName: string;
  status: DeploymentStatus;
  rollbackAvailable: boolean;
  deployedAt: string;
}

export interface ChangelogEntry {
  id: number;
  releaseId: number;
  releaseName: string;
  title: string;
  entryType: string;
  description: string;
  createdAt: string;
}

export interface AuditLog {
  id: number;
  actor: string;
  action: string;
  entityName: string;
  entityId: string | null;
  details: string | null;
  createdAt: string;
}
