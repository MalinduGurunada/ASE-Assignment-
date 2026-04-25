package com.rmt.web.dto;

import com.rmt.domain.DeploymentStatus;
import java.time.Instant;

public class DeploymentResponse {

    private Long id;
    private Long releaseId;
    private String releaseName;
    private String environmentName;
    private DeploymentStatus status;
    private boolean rollbackAvailable;
    private Instant deployedAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getReleaseId() {
        return releaseId;
    }

    public void setReleaseId(Long releaseId) {
        this.releaseId = releaseId;
    }

    public String getReleaseName() {
        return releaseName;
    }

    public void setReleaseName(String releaseName) {
        this.releaseName = releaseName;
    }

    public String getEnvironmentName() {
        return environmentName;
    }

    public void setEnvironmentName(String environmentName) {
        this.environmentName = environmentName;
    }

    public DeploymentStatus getStatus() {
        return status;
    }

    public void setStatus(DeploymentStatus status) {
        this.status = status;
    }

    public boolean isRollbackAvailable() {
        return rollbackAvailable;
    }

    public void setRollbackAvailable(boolean rollbackAvailable) {
        this.rollbackAvailable = rollbackAvailable;
    }

    public Instant getDeployedAt() {
        return deployedAt;
    }

    public void setDeployedAt(Instant deployedAt) {
        this.deployedAt = deployedAt;
    }
}
