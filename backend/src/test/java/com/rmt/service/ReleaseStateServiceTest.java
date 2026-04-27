package com.rmt.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import com.rmt.domain.Release;
import com.rmt.domain.ReleaseStatus;
import com.rmt.repository.ReleaseRepository;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ReleaseStateServiceTest {

    @Mock
    private ReleaseRepository releaseRepository;

    @InjectMocks
    private ReleaseStateService releaseStateService;

    @Test
    void transitionAllAllowedStates() {
        Release release = new Release();
        release.setId(1L);
        release.setStatus(ReleaseStatus.DRAFT);

        when(releaseRepository.findById(1L)).thenReturn(Optional.of(release));
        when(releaseRepository.save(any(Release.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Release testing = releaseStateService.transition(1L, ReleaseStatus.TESTING);
        assertEquals(ReleaseStatus.TESTING, testing.getStatus());

        Release approved = releaseStateService.transition(1L, ReleaseStatus.APPROVED);
        assertEquals(ReleaseStatus.APPROVED, approved.getStatus());

        Release released = releaseStateService.transition(1L, ReleaseStatus.RELEASED);
        assertEquals(ReleaseStatus.RELEASED, released.getStatus());
    }

    @Test
    void rejectInvalidTransition() {
        Release release = new Release();
        release.setId(2L);
        release.setStatus(ReleaseStatus.DRAFT);

        when(releaseRepository.findById(2L)).thenReturn(Optional.of(release));

        assertThrows(IllegalStateException.class, () -> releaseStateService.transition(2L, ReleaseStatus.APPROVED));
    }
}
