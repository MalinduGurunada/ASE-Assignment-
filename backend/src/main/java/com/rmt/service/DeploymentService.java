package com.rmt.service;

import com.rmt.audit.AuditableAction;
import com.rmt.domain.Deployment;
import com.rmt.domain.Release;
import com.rmt.repository.DeploymentRepository;
import com.rmt.repository.ReleaseRepository;
import com.rmt.web.dto.DeploymentRequest;
import com.rmt.web.dto.DeploymentResponse;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DeploymentService {

    private final DeploymentRepository deploymentRepository;
    private final ReleaseRepository releaseRepository;

    public DeploymentService(DeploymentRepository deploymentRepository, ReleaseRepository releaseRepository) {
        this.deploymentRepository = deploymentRepository;
        this.releaseRepository = releaseRepository;
    }

    @Transactional(readOnly = true)
    public List<DeploymentResponse> findAll() {
        return deploymentRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<DeploymentResponse> findByRelease(Long releaseId) {
        return deploymentRepository.findByReleaseId(releaseId).stream().map(this::toResponse).toList();
    }

    @AuditableAction(action = "CREATE_DEPLOYMENT", entity = "Deployment")
    public DeploymentResponse create(DeploymentRequest request) {
        Release release = releaseRepository.findById(request.getReleaseId())
            .orElseThrow(() -> new IllegalArgumentException("Release not found: " + request.getReleaseId()));

        Deployment deployment = new Deployment();
        deployment.setRelease(release);
        deployment.setEnvironmentName(request.getEnvironmentName());
        deployment.setStatus(request.getStatus());
        deployment.setRollbackAvailable(request.isRollbackAvailable());
        return toResponse(deploymentRepository.save(deployment));
    }

    @AuditableAction(action = "UPDATE_DEPLOYMENT", entity = "Deployment")
    public DeploymentResponse update(Long id, DeploymentRequest request) {
        Release release = releaseRepository.findById(request.getReleaseId())
            .orElseThrow(() -> new IllegalArgumentException("Release not found: " + request.getReleaseId()));

        Deployment deployment = deploymentRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Deployment not found: " + id));

        deployment.setRelease(release);
        deployment.setEnvironmentName(request.getEnvironmentName());
        deployment.setStatus(request.getStatus());
        deployment.setRollbackAvailable(request.isRollbackAvailable());

        return toResponse(deploymentRepository.save(deployment));
    }

    @AuditableAction(action = "DELETE_DEPLOYMENT", entity = "Deployment")
    public void delete(Long id) {
        if (!deploymentRepository.existsById(id)) {
            throw new IllegalArgumentException("Deployment not found: " + id);
        }
        deploymentRepository.deleteById(id);
    }

    private DeploymentResponse toResponse(Deployment deployment) {
        DeploymentResponse response = new DeploymentResponse();
        response.setId(deployment.getId());
        response.setReleaseId(deployment.getRelease().getId());
        response.setReleaseName(deployment.getRelease().getName());
        response.setEnvironmentName(deployment.getEnvironmentName());
        response.setStatus(deployment.getStatus());
        response.setRollbackAvailable(deployment.isRollbackAvailable());
        response.setDeployedAt(deployment.getDeployedAt());
        return response;
    }
}
