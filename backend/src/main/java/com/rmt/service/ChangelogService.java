package com.rmt.service;

import com.rmt.audit.AuditableAction;
import com.rmt.domain.ChangelogEntry;
import com.rmt.domain.Release;
import com.rmt.repository.ChangelogEntryRepository;
import com.rmt.repository.ReleaseRepository;
import com.rmt.web.dto.ChangelogEntryRequest;
import com.rmt.web.dto.ChangelogEntryResponse;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ChangelogService {

    private final ChangelogEntryRepository changelogEntryRepository;
    private final ReleaseRepository releaseRepository;

    public ChangelogService(ChangelogEntryRepository changelogEntryRepository, ReleaseRepository releaseRepository) {
        this.changelogEntryRepository = changelogEntryRepository;
        this.releaseRepository = releaseRepository;
    }

    public List<ChangelogEntryResponse> findByRelease(Long releaseId) {
        return changelogEntryRepository.findByReleaseIdOrderByCreatedAtDesc(releaseId).stream()
            .map(this::toResponse)
            .toList();
    }

    @AuditableAction(action = "CREATE_CHANGELOG_ENTRY", entity = "ChangelogEntry")
    public ChangelogEntryResponse create(ChangelogEntryRequest request) {
        Release release = releaseRepository.findById(request.getReleaseId())
            .orElseThrow(() -> new IllegalArgumentException("Release not found: " + request.getReleaseId()));

        ChangelogEntry entry = new ChangelogEntry();
        entry.setRelease(release);
        entry.setTitle(request.getTitle());
        entry.setEntryType(request.getEntryType());
        entry.setDescription(request.getDescription());
        return toResponse(changelogEntryRepository.save(entry));
    }

    @AuditableAction(action = "DELETE_CHANGELOG_ENTRY", entity = "ChangelogEntry")
    public void delete(Long id) {
        if (!changelogEntryRepository.existsById(id)) {
            throw new IllegalArgumentException("Changelog entry not found: " + id);
        }
        changelogEntryRepository.deleteById(id);
    }

    private ChangelogEntryResponse toResponse(ChangelogEntry entry) {
        ChangelogEntryResponse response = new ChangelogEntryResponse();
        response.setId(entry.getId());
        response.setReleaseId(entry.getRelease().getId());
        response.setReleaseName(entry.getRelease().getName());
        response.setTitle(entry.getTitle());
        response.setEntryType(entry.getEntryType());
        response.setDescription(entry.getDescription());
        response.setCreatedAt(entry.getCreatedAt());
        return response;
    }
}
