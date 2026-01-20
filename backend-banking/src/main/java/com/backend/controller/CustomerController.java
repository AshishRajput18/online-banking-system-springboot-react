package com.backend.controller;

import com.backend.dto.CustomerListResponseDTO;
import com.backend.dto.ApiResponse;
import com.backend.dto.CustomerRegisterRequest;
import com.backend.service.CustomerService;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customer")
@CrossOrigin(origins = "http://localhost:5173")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @PostMapping("/register")
    @PreAuthorize("hasRole('BANK')")
    public ResponseEntity<ApiResponse> registerCustomer(
            @RequestBody CustomerRegisterRequest request,
            Authentication authentication
    ) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse("Unauthorized access"));
        }

        String managerEmail = authentication.getName();
        customerService.registerCustomer(request, managerEmail);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse("Customer registered and linked with bank successfully"));
    }

 // Controller
    @GetMapping("/all")
    @PreAuthorize("hasRole('BANK')")
    public ResponseEntity<List<CustomerListResponseDTO>> getAllCustomers(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        String managerEmail = authentication.getName();
        List<CustomerListResponseDTO> customers = customerService.getAllCustomers(managerEmail);

        return ResponseEntity.ok(customers);
    }


    // 🔹 DELETE CUSTOMER
    @DeleteMapping("/delete")
    @PreAuthorize("hasRole('BANK')")
    public ResponseEntity<ApiResponse> deleteCustomer(@RequestParam String email) {
        customerService.deleteCustomer(email);
        return ResponseEntity.ok(new ApiResponse("Customer deleted successfully"));
    }
}
