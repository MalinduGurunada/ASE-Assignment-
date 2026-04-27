package com.rmt.web;

import com.rmt.repository.AuditLogRepository;
import com.rmt.web.dto.AuditLogResponse;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/audit-logs")
public class AuditLogController {

    private final AuditLogRepository auditLogRepository;

    public AuditLogController(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','VIEWER')")
    public List<AuditLogResponse> listRecent() {
        return auditLogRepository.findTop100ByOrderByCreatedAtDesc().stream().map(log -> {
            AuditLogResponse response = new AuditLogResponse();
            response.setId(log.getId());
            response.setActor(log.getActor());
            response.setAction(log.getAction());
            response.setEntityName(log.getEntityName());
            response.setEntityId(log.getEntityId());
            response.setDetails(log.getDetails());
            response.setCreatedAt(log.getCreatedAt());
            return response;
        }).toList();
    }
}
