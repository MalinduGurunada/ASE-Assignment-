package com.rmt.web.dto;

import com.rmt.domain.DeploymentStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class DeploymentRequest {

    @NotNull
    private Long releaseId;

    @NotBlank
    private String environmentName;

    @NotNull
    private DeploymentStatus status;

    private boolean rollbackAvailable;

    public Long getReleaseId() {
        return releaseId;
    }

    public void setReleaseId(Long releaseId) {
        this.releaseId = releaseId;
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
}
