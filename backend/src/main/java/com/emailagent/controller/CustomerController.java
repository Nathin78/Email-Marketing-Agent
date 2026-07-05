package com.emailagent.controller;

import com.emailagent.dto.ApiResponse;
import com.emailagent.dto.CustomerRequest;
import com.emailagent.entity.Customer;
import com.emailagent.service.CustomerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
@Tag(name = "Customers")
public class CustomerController {
    private final CustomerService customerService;

    @GetMapping
    @Operation(summary = "List customers")
    public ResponseEntity<ApiResponse<List<Customer>>> getAll() {
        return ResponseEntity.ok(ApiResponse.<List<Customer>>builder().success(true).message("Customers retrieved").data(customerService.getAllCustomers()).build());
    }

    @PostMapping
    @Operation(summary = "Create customer")
    public ResponseEntity<ApiResponse<Customer>> create(@Valid @RequestBody CustomerRequest request) {
        return ResponseEntity.ok(ApiResponse.<Customer>builder().success(true).message("Customer created").data(customerService.createCustomer(request)).build());
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update customer")
    public ResponseEntity<ApiResponse<Customer>> update(@PathVariable Long id, @Valid @RequestBody CustomerRequest request) {
        return ResponseEntity.ok(ApiResponse.<Customer>builder().success(true).message("Customer updated").data(customerService.updateCustomer(id, request)).build());
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete customer")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.ok(ApiResponse.<Void>builder().success(true).message("Customer deleted").build());
    }
}
