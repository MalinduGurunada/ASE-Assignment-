package com.rmt.web;

import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class AccessController {

    @GetMapping("/admin/ping")
    public ResponseEntity<Map<String, String>> adminPing() {
        return ResponseEntity.ok(Map.of("message", "admin access granted"));
    }

    @GetMapping("/view/ping")
    public ResponseEntity<Map<String, String>> viewerPing() {
        return ResponseEntity.ok(Map.of("message", "viewer access granted"));
    }
}
