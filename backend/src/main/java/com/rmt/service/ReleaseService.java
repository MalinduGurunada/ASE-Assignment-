package com.rmt.service;

import com.rmt.audit.AuditableAction;
import com.rmt.domain.Product;
import com.rmt.domain.Release;
import com.rmt.repository.ProductRepository;
import com.rmt.repository.ReleaseRepository;
import com.rmt.web.dto.ReleaseRequest;
import com.rmt.web.dto.ReleaseResponse;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReleaseService {

    private final ReleaseRepository releaseRepository;
    private final ProductRepository productRepository;

    public ReleaseService(ReleaseRepository releaseRepository, ProductRepository productRepository) {
        this.releaseRepository = releaseRepository;
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public List<ReleaseResponse> findAll() {
        return releaseRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public ReleaseResponse findById(Long id) {
        Release release = releaseRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Release not found: " + id));
        return toResponse(release);
    }

    @AuditableAction(action = "CREATE_RELEASE", entity = "Release")
    public ReleaseResponse create(ReleaseRequest request) {
        Product product = productRepository.findById(request.getProductId())
            .orElseThrow(() -> new IllegalArgumentException("Product not found: " + request.getProductId()));

        Release release = new Release();
        release.setProduct(product);
        release.setVersion(request.getVersion());
        release.setName(request.getName());
        return toResponse(releaseRepository.save(release));
    }

    @AuditableAction(action = "UPDATE_RELEASE", entity = "Release")
    public ReleaseResponse update(Long id, ReleaseRequest request) {
        Product product = productRepository.findById(request.getProductId())
            .orElseThrow(() -> new IllegalArgumentException("Product not found: " + request.getProductId()));

        Release release = releaseRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Release not found: " + id));

        release.setProduct(product);
        release.setVersion(request.getVersion());
        release.setName(request.getName());
        return toResponse(releaseRepository.save(release));
    }

    @AuditableAction(action = "DELETE_RELEASE", entity = "Release")
    public void delete(Long id) {
        if (!releaseRepository.existsById(id)) {
            throw new IllegalArgumentException("Release not found: " + id);
        }
        releaseRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<ReleaseResponse> findByProduct(Long productId) {
        return releaseRepository.findByProductId(productId).stream().map(this::toResponse).toList();
    }

    private ReleaseResponse toResponse(Release release) {
        ReleaseResponse response = new ReleaseResponse();
        response.setId(release.getId());
        response.setProductId(release.getProduct().getId());
        response.setProductName(release.getProduct().getName());
        response.setVersion(release.getVersion());
        response.setName(release.getName());
        response.setStatus(release.getStatus());
        response.setCreatedAt(release.getCreatedAt());
        response.setReleasedAt(release.getReleasedAt());
        return response;
    }
}
