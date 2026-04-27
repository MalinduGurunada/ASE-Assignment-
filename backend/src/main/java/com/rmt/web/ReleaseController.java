package com.rmt.web;

import com.rmt.service.ReleaseService;
import com.rmt.service.ReleaseStateService;
import com.rmt.web.dto.ReleaseRequest;
import com.rmt.web.dto.ReleaseResponse;
import com.rmt.web.dto.ReleaseStatusTransitionRequest;
import jakarta.validation.Valid;
import java.nio.charset.StandardCharsets;
import java.util.List;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/releases")
public class ReleaseController {

    private final ReleaseService releaseService;
    private final ReleaseStateService releaseStateService;

    public ReleaseController(ReleaseService releaseService, ReleaseStateService releaseStateService) {
        this.releaseService = releaseService;
        this.releaseStateService = releaseStateService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','VIEWER')")
    public List<ReleaseResponse> list(@RequestParam(required = false) Long productId) {
        return productId == null ? releaseService.findAll() : releaseService.findByProduct(productId);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','VIEWER')")
    public ReleaseResponse get(@PathVariable Long id) {
        return releaseService.findById(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ReleaseResponse create(@Valid @RequestBody ReleaseRequest request) {
        return releaseService.create(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ReleaseResponse update(@PathVariable Long id, @Valid @RequestBody ReleaseRequest request) {
        return releaseService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        releaseService.delete(id);
    }

    @PostMapping("/{id}/transition")
    @PreAuthorize("hasRole('ADMIN')")
    public ReleaseResponse transition(@PathVariable Long id, @Valid @RequestBody ReleaseStatusTransitionRequest request) {
        releaseStateService.transition(id, request.getTargetStatus());
        return releaseService.findById(id);
    }

    @GetMapping(value = "/export.csv", produces = "text/csv")
    @PreAuthorize("hasAnyRole('ADMIN','VIEWER')")
    public ResponseEntity<byte[]> exportCsv() {
        StringBuilder csv = new StringBuilder();
        csv.append("id,productId,productName,name,version,status,createdAt,releasedAt\n");
        for (ReleaseResponse release : releaseService.findAll()) {
            csv.append(release.getId()).append(',')
                .append(release.getProductId()).append(',')
                .append(escape(release.getProductName())).append(',')
                .append(escape(release.getName())).append(',')
                .append(escape(release.getVersion())).append(',')
                .append(release.getStatus()).append(',')
                .append(release.getCreatedAt()).append(',')
                .append(release.getReleasedAt())
                .append('\n');
        }

        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=releases.csv")
            .contentType(new MediaType("text", "csv", StandardCharsets.UTF_8))
            .body(csv.toString().getBytes(StandardCharsets.UTF_8));
    }

    private String escape(String value) {
        if (value == null) {
            return "";
        }
        return '"' + value.replace("\"", "\"\"") + '"';
    }
}
