package com.emailagent.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import java.util.HashMap;
import java.util.Map;

@Controller
public class RealtimeController {

    // Campaign Status Updates
    @MessageMapping("/campaign/status")
    @SendTo("/topic/campaign-status")
    public Map<String, Object> campaignStatusUpdate(Map<String, Object> message) {
        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", System.currentTimeMillis());
        response.put("status", message.get("status"));
        response.put("campaignId", message.get("campaignId"));
        response.put("progress", message.get("progress"));
        response.put("sentCount", message.get("sentCount"));
        return response;
    }

    // Real-time Analytics
    @MessageMapping("/analytics/update")
    @SendTo("/topic/analytics-updates")
    public Map<String, Object> analyticsUpdate(Map<String, Object> message) {
        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", System.currentTimeMillis());
        response.put("opens", message.get("opens"));
        response.put("clicks", message.get("clicks"));
        response.put("bounces", message.get("bounces"));
        response.put("conversions", message.get("conversions"));
        response.put("campaignId", message.get("campaignId"));
        return response;
    }

    // Notifications
    @MessageMapping("/notification/send")
    @SendTo("/topic/notifications")
    public Map<String, Object> sendNotification(Map<String, Object> message) {
        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", System.currentTimeMillis());
        response.put("type", message.get("type"));
        response.put("message", message.get("message"));
        response.put("severity", message.get("severity"));
        response.put("actionUrl", message.get("actionUrl"));
        return response;
    }

    // Activity Updates
    @MessageMapping("/activity/log")
    @SendTo("/topic/activity-feed")
    public Map<String, Object> logActivity(Map<String, Object> message) {
        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", System.currentTimeMillis());
        response.put("userId", message.get("userId"));
        response.put("action", message.get("action"));
        response.put("target", message.get("target"));
        response.put("details", message.get("details"));
        return response;
    }

    // Deliverability Metrics
    @MessageMapping("/deliverability/metric")
    @SendTo("/topic/deliverability-metrics")
    public Map<String, Object> deliverabilityMetric(Map<String, Object> message) {
        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", System.currentTimeMillis());
        response.put("delivered", message.get("delivered"));
        response.put("bounced", message.get("bounced"));
        response.put("spam", message.get("spam"));
        response.put("campaignId", message.get("campaignId"));
        return response;
    }

    // Dashboard Updates
    @MessageMapping("/dashboard/metric")
    @SendTo("/topic/dashboard-metrics")
    public Map<String, Object> dashboardMetric(Map<String, Object> message) {
        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", System.currentTimeMillis());
        response.put("activeCampaigns", message.get("activeCampaigns"));
        response.put("totalRecipients", message.get("totalRecipients"));
        response.put("avgOpenRate", message.get("avgOpenRate"));
        response.put("avgClickRate", message.get("avgClickRate"));
        return response;
    }
}
