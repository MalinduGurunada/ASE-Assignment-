package com.rmt.web;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@SpringBootTest
@AutoConfigureMockMvc
class ApiSecurityIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void authEndpointsIssueToken() throws Exception {
        String token = registerAndGetToken("VIEWER");
        if (token == null || token.isBlank()) {
            throw new AssertionError("Expected non-empty token");
        }
    }

    @Test
    void securedEndpointRejectsAnonymous() throws Exception {
        mockMvc.perform(get("/api/products"))
            .andExpect(status().is4xxClientError());
    }

    @Test
    void viewerCanReadButCannotCreateProduct() throws Exception {
        String viewerToken = registerAndGetToken("VIEWER");

        mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + viewerToken)
                .content(objectMapper.writeValueAsString(Map.of(
                    "name", "Product-" + UUID.randomUUID(),
                    "description", "should fail"
                ))))
            .andExpect(status().isForbidden());

        mockMvc.perform(get("/api/products")
                .header("Authorization", "Bearer " + viewerToken))
            .andExpect(status().isOk());
    }

    @Test
    void adminCanCreateProductAndExportCsv() throws Exception {
        String adminToken = registerAndGetToken("ADMIN");

        mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + adminToken)
                .content(objectMapper.writeValueAsString(Map.of(
                    "name", "Product-" + UUID.randomUUID(),
                    "description", "integration"
                ))))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").isNumber())
            .andExpect(jsonPath("$.name").exists());

        mockMvc.perform(get("/api/releases/export.csv")
                .header("Authorization", "Bearer " + adminToken))
            .andExpect(status().isOk())
            .andExpect(header().string("Content-Disposition", "attachment; filename=releases.csv"));
    }

    private String registerAndGetToken(String role) throws Exception {
        String suffix = UUID.randomUUID().toString().substring(0, 8);
        String username = "user_" + suffix;
        String email = username + "@rmt.local";

        MvcResult registerResult = mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                    "username", username,
                    "email", email,
                    "password", "password123",
                    "role", role
                ))))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.accessToken").exists())
            .andReturn();

        JsonNode registerJson = objectMapper.readTree(registerResult.getResponse().getContentAsString());
        String registerToken = registerJson.path("accessToken").asText();
        if (!registerToken.isBlank()) {
            return registerToken;
        }

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                    "username", username,
                    "password", "password123"
                ))))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.accessToken").exists())
            .andReturn();

        JsonNode loginJson = objectMapper.readTree(loginResult.getResponse().getContentAsString());
        return loginJson.path("accessToken").asText();
    }
}
