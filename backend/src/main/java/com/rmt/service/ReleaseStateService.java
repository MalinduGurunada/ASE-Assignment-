package com.rmt.service;

import com.rmt.audit.AuditableAction;
import com.rmt.domain.Release;
import com.rmt.domain.ReleaseStatus;
import com.rmt.repository.ReleaseRepository;
import java.time.Instant;
import java.util.Map;
import java.util.Set;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReleaseStateService {

    private static final Map<ReleaseStatus, Set<ReleaseStatus>> ALLOWED_TRANSITIONS = Map.of(
        ReleaseStatus.DRAFT, Set.of(ReleaseStatus.TESTING),
        ReleaseStatus.TESTING, Set.of(ReleaseStatus.APPROVED),
        ReleaseStatus.APPROVED, Set.of(ReleaseStatus.RELEASED),
        ReleaseStatus.RELEASED, Set.of()
    );

    private final ReleaseRepository releaseRepository;

    public ReleaseStateService(ReleaseRepository releaseRepository) {
        this.releaseRepository = releaseRepository;
    }

    @Transactional
    @AuditableAction(action = "CHANGE_RELEASE_STATUS", entity = "Release")
    public Release transition(Long releaseId, ReleaseStatus targetStatus) {
        Release release = releaseRepository.findById(releaseId)
            .orElseThrow(() -> new IllegalArgumentException("Release not found: " + releaseId));

        ReleaseStatus current = release.getStatus();
        Set<ReleaseStatus> allowed = ALLOWED_TRANSITIONS.getOrDefault(current, Set.of());
        if (!allowed.contains(targetStatus)) {
            throw new IllegalStateException("Invalid transition from " + current + " to " + targetStatus);
        }

        release.setStatus(targetStatus);
        if (targetStatus == ReleaseStatus.RELEASED) {
            release.setReleasedAt(Instant.now());
        }
        return releaseRepository.save(release);
    }
}
