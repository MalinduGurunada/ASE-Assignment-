package com.rmt.web;

import com.rmt.service.ChangelogService;
import com.rmt.web.dto.ChangelogEntryRequest;
import com.rmt.web.dto.ChangelogEntryResponse;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/changelog")
public class ChangelogController {

    private final ChangelogService changelogService;

    public ChangelogController(ChangelogService changelogService) {
        this.changelogService = changelogService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','VIEWER')")
    public List<ChangelogEntryResponse> list(@RequestParam Long releaseId) {
        return changelogService.findByRelease(releaseId);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ChangelogEntryResponse create(@Valid @RequestBody ChangelogEntryRequest request) {
        return changelogService.create(request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        changelogService.delete(id);
    }
}
