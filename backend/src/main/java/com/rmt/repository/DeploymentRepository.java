package com.rmt.repository;

import com.rmt.domain.Deployment;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeploymentRepository extends JpaRepository<Deployment, Long> {
    List<Deployment> findByEnvironmentNameOrderByDeployedAtDesc(String environmentName);

    List<Deployment> findByReleaseId(Long releaseId);
}
