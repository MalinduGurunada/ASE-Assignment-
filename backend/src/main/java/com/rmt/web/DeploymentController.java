package com.rmt.web;

import com.rmt.service.DeploymentService;
import com.rmt.web.dto.DeploymentRequest;
import com.rmt.web.dto.DeploymentResponse;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/deployments")
public class DeploymentController {

    private final DeploymentService deploymentService;

    public DeploymentController(DeploymentService deploymentService) {
        this.deploymentService = deploymentService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','VIEWER')")
    public List<DeploymentResponse> list(@RequestParam(required = false) Long releaseId) {
        return releaseId == null ? deploymentService.findAll() : deploymentService.findByRelease(releaseId);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public DeploymentResponse create(@Valid @RequestBody DeploymentRequest request) {
        return deploymentService.create(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public DeploymentResponse update(@PathVariable Long id, @Valid @RequestBody DeploymentRequest request) {
        return deploymentService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        deploymentService.delete(id);
    }
}
