package com.rmt.service;

import com.rmt.audit.AuditableAction;
import com.rmt.domain.Product;
import com.rmt.repository.ProductRepository;
import com.rmt.web.dto.ProductRequest;
import com.rmt.web.dto.ProductResponse;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<ProductResponse> findAll() {
        return productRepository.findAll().stream().map(this::toResponse).toList();
    }

    public ProductResponse findById(Long id) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Product not found: " + id));
        return toResponse(product);
    }

    @AuditableAction(action = "CREATE_PRODUCT", entity = "Product")
    public ProductResponse create(ProductRequest request) {
        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        return toResponse(productRepository.save(product));
    }

    @AuditableAction(action = "UPDATE_PRODUCT", entity = "Product")
    public ProductResponse update(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Product not found: " + id));
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        return toResponse(productRepository.save(product));
    }

    @AuditableAction(action = "DELETE_PRODUCT", entity = "Product")
    public void delete(Long id) {
        if (!productRepository.existsById(id)) {
            throw new IllegalArgumentException("Product not found: " + id);
        }
        productRepository.deleteById(id);
    }

    private ProductResponse toResponse(Product product) {
        ProductResponse response = new ProductResponse();
        response.setId(product.getId());
        response.setName(product.getName());
        response.setDescription(product.getDescription());
        response.setCreatedAt(product.getCreatedAt());
        return response;
    }
}
