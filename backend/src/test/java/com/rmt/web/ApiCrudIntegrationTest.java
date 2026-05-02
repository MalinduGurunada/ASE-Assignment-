package com.rmt.web;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@SpringBootTest
@AutoConfigureMockMvc
class ApiCrudIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String adminToken;
    private long productId;

    @BeforeEach
    void setUp() throws Exception {
        String suffix = UUID.randomUUID().toString().substring(0, 8);
        String username = "crud_" + suffix;

        MvcResult reg = mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                    "username", username,
                    "email", username + "@rmt.local",
                    "password", "password123",
                    "role", "ADMIN"
                ))))
            .andExpect(status().isOk())
            .andReturn();

        adminToken = objectMapper.readTree(reg.getResponse().getContentAsString())
            .path("accessToken").asText();

        MvcResult prod = mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + adminToken)
                .content(objectMapper.writeValueAsString(Map.of(
                    "name", "Product-" + suffix,
                    "description", "crud test"
                ))))
            .andExpect(status().isOk())
            .andReturn();

        productId = objectMapper.readTree(prod.getResponse().getContentAsString())
            .path("id").asLong();
    }

    // ── Releases ────────────────────────────────────────────────────────────

    @Test
    void adminCanListReleases() throws Exception {
        mockMvc.perform(get("/api/releases")
                .header("Authorization", "Bearer " + adminToken))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray());
    }

    @Test
    void adminCanCreateAndGetReleaseById() throws Exception {
        String name = "Release-" + UUID.randomUUID().toString().substring(0, 6);

        MvcResult create = mockMvc.perform(post("/api/releases")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + adminToken)
                .content(objectMapper.writeValueAsString(Map.of(
                    "productId", productId,
                    "version", "1.0.0",
                    "name", name
                ))))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").isNumber())
            .andExpect(jsonPath("$.status").value("DRAFT"))
            .andReturn();

        long releaseId = objectMapper.readTree(create.getResponse().getContentAsString())
            .path("id").asLong();

        mockMvc.perform(get("/api/releases/" + releaseId)
                .header("Authorization", "Bearer " + adminToken))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(releaseId))
            .andExpect(jsonPath("$.name").value(name));
    }

    @Test
    void adminCanUpdateRelease() throws Exception {
        MvcResult create = mockMvc.perform(post("/api/releases")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + adminToken)
                .content(objectMapper.writeValueAsString(Map.of(
                    "productId", productId,
                    "version", "2.0.0",
                    "name", "Original-" + UUID.randomUUID().toString().substring(0, 6)
                ))))
            .andExpect(status().isOk())
            .andReturn();

        long releaseId = objectMapper.readTree(create.getResponse().getContentAsString())
            .path("id").asLong();
        String updatedName = "Updated-" + UUID.randomUUID().toString().substring(0, 6);

        mockMvc.perform(put("/api/releases/" + releaseId)
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + adminToken)
                .content(objectMapper.writeValueAsString(Map.of(
                    "productId", productId,
                    "version", "2.0.1",
                    "name", updatedName
                ))))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value(updatedName))
            .andExpect(jsonPath("$.version").value("2.0.1"));
    }

    @Test
    void adminCanDeleteRelease() throws Exception {
        MvcResult create = mockMvc.perform(post("/api/releases")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + adminToken)
                .content(objectMapper.writeValueAsString(Map.of(
                    "productId", productId,
                    "version", "3.0.0",
                    "name", "ToDelete-" + UUID.randomUUID().toString().substring(0, 6)
                ))))
            .andExpect(status().isOk())
            .andReturn();

        long releaseId = objectMapper.readTree(create.getResponse().getContentAsString())
            .path("id").asLong();

        mockMvc.perform(delete("/api/releases/" + releaseId)
                .header("Authorization", "Bearer " + adminToken))
            .andExpect(status().isOk());

        mockMvc.perform(get("/api/releases/" + releaseId)
                .header("Authorization", "Bearer " + adminToken))
            .andExpect(status().is4xxClientError());
    }

    @Test
    void adminCanTransitionReleaseState() throws Exception {
        MvcResult create = mockMvc.perform(post("/api/releases")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + adminToken)
                .content(objectMapper.writeValueAsString(Map.of(
                    "productId", productId,
                    "version", "4.0.0",
                    "name", "Transition-" + UUID.randomUUID().toString().substring(0, 6)
                ))))
            .andExpect(status().isOk())
            .andReturn();

        long releaseId = objectMapper.readTree(create.getResponse().getContentAsString())
            .path("id").asLong();

        mockMvc.perform(post("/api/releases/" + releaseId + "/transition")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + adminToken)
                .content(objectMapper.writeValueAsString(Map.of("targetStatus", "TESTING"))))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("TESTING"));
    }

    // ── Deployments ──────────────────────────────────────────────────────────

    @Test
    void adminCanCreateAndListDeployment() throws Exception {
        MvcResult releaseRes = mockMvc.perform(post("/api/releases")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + adminToken)
                .content(objectMapper.writeValueAsString(Map.of(
                    "productId", productId,
                    "version", "5.0.0",
                    "name", "ForDeploy-" + UUID.randomUUID().toString().substring(0, 6)
                ))))
            .andExpect(status().isOk())
            .andReturn();

        long releaseId = objectMapper.readTree(releaseRes.getResponse().getContentAsString())
            .path("id").asLong();

        mockMvc.perform(post("/api/deployments")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + adminToken)
                .content(objectMapper.writeValueAsString(Map.of(
                    "releaseId", releaseId,
                    "environmentName", "staging",
                    "status", "PENDING",
                    "rollbackAvailable", false
                ))))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").isNumber())
            .andExpect(jsonPath("$.environmentName").value("staging"));

        mockMvc.perform(get("/api/deployments")
                .header("Authorization", "Bearer " + adminToken))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray());
    }

    @Test
    void viewerCannotCreateDeployment() throws Exception {
        String suffix = UUID.randomUUID().toString().substring(0, 8);
        MvcResult viewerReg = mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                    "username", "viewer_" + suffix,
                    "email", "viewer_" + suffix + "@rmt.local",
                    "password", "password123",
                    "role", "VIEWER"
                ))))
            .andExpect(status().isOk())
            .andReturn();

        String viewerToken = objectMapper.readTree(viewerReg.getResponse().getContentAsString())
            .path("accessToken").asText();

        mockMvc.perform(post("/api/deployments")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + viewerToken)
                .content(objectMapper.writeValueAsString(Map.of(
                    "releaseId", 1,
                    "environmentName", "prod",
                    "status", "PENDING",
                    "rollbackAvailable", false
                ))))
            .andExpect(status().isForbidden());
    }

    // ── Changelog ────────────────────────────────────────────────────────────

    @Test
    void adminCanCreateAndListChangelogEntry() throws Exception {
        MvcResult releaseRes = mockMvc.perform(post("/api/releases")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + adminToken)
                .content(objectMapper.writeValueAsString(Map.of(
                    "productId", productId,
                    "version", "6.0.0",
                    "name", "ForChangelog-" + UUID.randomUUID().toString().substring(0, 6)
                ))))
            .andExpect(status().isOk())
            .andReturn();

        long releaseId = objectMapper.readTree(releaseRes.getResponse().getContentAsString())
            .path("id").asLong();

        MvcResult entry = mockMvc.perform(post("/api/changelog")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + adminToken)
                .content(objectMapper.writeValueAsString(Map.of(
                    "releaseId", releaseId,
                    "title", "Fix login timeout",
                    "entryType", "bugfix",
                    "description", "Increased session timeout to 30 min"
                ))))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").isNumber())
            .andExpect(jsonPath("$.title").value("Fix login timeout"))
            .andReturn();

        long entryId = objectMapper.readTree(entry.getResponse().getContentAsString())
            .path("id").asLong();

        mockMvc.perform(get("/api/changelog?releaseId=" + releaseId)
                .header("Authorization", "Bearer " + adminToken))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$[0].title").value("Fix login timeout"));

        mockMvc.perform(delete("/api/changelog/" + entryId)
                .header("Authorization", "Bearer " + adminToken))
            .andExpect(status().isOk());
    }

    // ── Audit logs ───────────────────────────────────────────────────────────

    @Test
    void adminCanReadAuditLogs() throws Exception {
        mockMvc.perform(get("/api/audit-logs")
                .header("Authorization", "Bearer " + adminToken))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray());
    }

    @Test
    void anonymousCannotReadAuditLogs() throws Exception {
        mockMvc.perform(get("/api/audit-logs"))
            .andExpect(status().is4xxClientError());
    }
}
