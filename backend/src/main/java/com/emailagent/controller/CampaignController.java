package com.emailagent.controller;

import com.emailagent.dto.ApiResponse;
import com.emailagent.dto.CampaignRequest;
import com.emailagent.entity.Campaign;
import com.emailagent.service.CampaignService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/campaigns")
@RequiredArgsConstructor
@Tag(name = "Campaigns")
public class CampaignController {
    private final CampaignService campaignService;

    @GetMapping
    @Operation(summary = "List campaigns")
    public ResponseEntity<ApiResponse<List<Campaign>>> getAll() {
        return ResponseEntity.ok(ApiResponse.<List<Campaign>>builder().success(true).message("Campaigns retrieved").data(campaignService.getAllCampaigns()).build());
    }

    @PostMapping
    @Operation(summary = "Create campaign")
    public ResponseEntity<ApiResponse<Campaign>> create(@Valid @RequestBody CampaignRequest request) {
        return ResponseEntity.ok(ApiResponse.<Campaign>builder().success(true).message("Campaign created").data(campaignService.createCampaign(request)).build());
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete campaign")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        campaignService.deleteCampaign(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder().success(true).message("Campaign deleted").build());
    }
}
