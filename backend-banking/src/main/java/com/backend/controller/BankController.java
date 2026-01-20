package com.backend.controller;

import com.backend.dto.AddBankRequest;
import com.backend.dto.ApiResponse;
import com.backend.dto.BankManagerDTO;
import com.backend.dto.BankManagerResponseDTO;
import com.backend.dto.BankResponseDTO;
import com.backend.service.AdminService;
import com.backend.service.BankManagerService;
import com.backend.service.BankService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class BankController {

    private final BankService bankService;
    private final AdminService adminService;
    private final BankManagerService bankManagerService;

    public BankController(BankService bankService, AdminService adminService,BankManagerService bankManagerService) {
        this.bankService = bankService;
        this.adminService = adminService;
        this.bankManagerService=bankManagerService;
    }

    // ✅ ADD BANK
 // ✅ ADD BANK
    @PostMapping("/bank/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> addBank(
            @RequestBody AddBankRequest request,
            Authentication authentication
    ) {
        // Check if authentication is present and valid
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity
                    .status(401)
                    .body(new ApiResponse("Unauthorized"));
        }

        // Get admin email from JWT
        String adminEmail = authentication.getName();
        System.out.println("🔥 ADMIN EMAIL FROM JWT = " + adminEmail);

        try {
            bankService.addBank(request, adminEmail);
            return ResponseEntity.ok(new ApiResponse("Bank Registered Successfully"));
        } catch (RuntimeException ex) {
            // Handle service exceptions like Admin or BankManager not found
            return ResponseEntity
                    .status(400)
                    .body(new ApiResponse("Error: " + ex.getMessage()));
        }
    }


    // ✅ GET ALL BANK MANAGERS
    @GetMapping("/bank-managers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BankManagerDTO>> getAllBankManagers() {
        return ResponseEntity.ok(adminService.getAllBankManagers());
    }
    
    // ✅ GET ALL BANKS
    @GetMapping("/banks")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BankResponseDTO>> getAllBanks() {
        return ResponseEntity.ok(bankService.getAllBanks());
    }
    
 // ✅ GET ALL BANK MANAGERS
    @GetMapping("/bank/managers")
    public ResponseEntity<List<BankManagerResponseDTO>> getAllBankManager() {
        return ResponseEntity.ok(bankManagerService.getAllManager());
    }
}
