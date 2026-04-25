package com.rmt.audit;

import com.rmt.domain.AuditLog;
import com.rmt.repository.AuditLogRepository;
import java.util.Objects;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class AuditAspect {

    private final AuditLogRepository auditLogRepository;

    public AuditAspect(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @AfterReturning("@annotation(auditableAction)")
    public void logAction(JoinPoint joinPoint, AuditableAction auditableAction) {
        AuditLog auditLog = new AuditLog();
        auditLog.setActor(resolveActor());
        auditLog.setAction(auditableAction.action());
        auditLog.setEntityName(resolveEntityName(joinPoint, auditableAction));
        auditLog.setDetails(joinPoint.getSignature().toShortString());
        auditLogRepository.save(auditLog);
    }

    private String resolveActor() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth == null ? "system" : Objects.toString(auth.getName(), "system");
    }

    private String resolveEntityName(JoinPoint joinPoint, AuditableAction auditableAction) {
        if (!auditableAction.entity().isBlank()) {
            return auditableAction.entity();
        }
        return joinPoint.getTarget().getClass().getSimpleName();
    }
}
