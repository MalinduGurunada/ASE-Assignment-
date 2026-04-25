package com.rmt.repository;

import com.rmt.domain.Release;
import com.rmt.domain.ReleaseStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReleaseRepository extends JpaRepository<Release, Long> {
    List<Release> findByStatus(ReleaseStatus status);

    List<Release> findByProductId(Long productId);
}
