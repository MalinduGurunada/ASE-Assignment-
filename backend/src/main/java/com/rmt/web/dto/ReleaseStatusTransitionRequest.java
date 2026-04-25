package com.rmt.web.dto;

import com.rmt.domain.ReleaseStatus;
import jakarta.validation.constraints.NotNull;

public class ReleaseStatusTransitionRequest {

    @NotNull
    private ReleaseStatus targetStatus;

    public ReleaseStatus getTargetStatus() {
        return targetStatus;
    }

    public void setTargetStatus(ReleaseStatus targetStatus) {
        this.targetStatus = targetStatus;
    }
}
