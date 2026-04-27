package com.rmt.repository;

import com.rmt.domain.ChangelogEntry;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChangelogEntryRepository extends JpaRepository<ChangelogEntry, Long> {
    List<ChangelogEntry> findByReleaseIdOrderByCreatedAtDesc(Long releaseId);
}
