package com.backend.controller;

import com.backend.dto.AccountDetailResponseDTO;
import com.backend.dto.AddAccountRequest;
import com.backend.dto.AmountRequestDTO;
import com.backend.dto.CustomerAccountInfoDTO;
import com.backend.entity.BankAccount;
import com.backend.dto.ApiResponse;
import com.backend.repository.BankAccountRepository;
import com.backend.service.BankAccountService;
import com.backend.dto.TransactionResponseDTO;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bank/account")
@CrossOrigin(origins = "http://localhost:5173")
public class BankAccountController {

    private final BankAccountService bankAccountService;
    private final BankAccountRepository bankAccountRepository;

    public BankAccountController(
            BankAccountService bankAccountService,
            BankAccountRepository bankAccountRepository
    ) {
        this.bankAccountService = bankAccountService;
        this.bankAccountRepository = bankAccountRepository;
    }

    // ✅ FETCH CUSTOMER + BANK INFO FOR ADD ACCOUNT PAGE
    @GetMapping("/customer-info")
    @PreAuthorize("hasRole('BANK')")
    public ResponseEntity<CustomerAccountInfoDTO> getCustomerInfo(
            @RequestParam String email,
            Authentication authentication
    ) {
        CustomerAccountInfoDTO dto =
                bankAccountService.getCustomerInfo(authentication.getName(), email);

        return ResponseEntity.ok(dto);
    }

    // ✅ ADD BANK ACCOUNT
    @PostMapping("/add")
    @PreAuthorize("hasRole('BANK')")
    public ResponseEntity<ApiResponse> addAccount(
            @RequestBody AddAccountRequest request,
            Authentication authentication
    ) {
        bankAccountService.addAccount(authentication.getName(), request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new ApiResponse("Bank account created successfully"));
    }

//    // ✅ CHECK IF ACCOUNT EXISTS (FOR FRONTEND LOGIC)
    @GetMapping("/exists")
    @PreAuthorize("hasRole('BANK')")
    public ResponseEntity<Boolean> isAccountExists(
            @RequestParam String email
    ) {
        boolean exists = bankAccountRepository.existsByCustomer_Email(email);
        return ResponseEntity.ok(exists);
    }

    // ✅ DEACTIVATE BANK ACCOUNT
    @PutMapping("/deactivate")
    @PreAuthorize("hasRole('BANK')")
    public ResponseEntity<ApiResponse> deactivateAccount(
            @RequestParam String email
    ) {
        bankAccountService.deactivateAccount(email);

        return ResponseEntity.ok(
                new ApiResponse("Account deactivated successfully")
        );
    }
    @GetMapping("/status")
    public String getAccountStatus(@RequestParam String email) {
        return bankAccountRepository
                .findByCustomer_Email(email)
                .map(BankAccount::getStatus)
                .orElse("INACTIVE");
    }
    
    @GetMapping("/detail")
    public AccountDetailResponseDTO getAccount(@RequestParam String email) {
        return  bankAccountService.getAccountDetail(email);
    }

    @GetMapping("/transactions")
    @PreAuthorize("hasRole('BANK')")
    public List<TransactionResponseDTO> getTransactions(@RequestParam String email) {
        return  bankAccountService.getTransactions(email);
    }

    @PostMapping("/deposit")
    @PreAuthorize("hasRole('BANK')")
    public void deposit(@RequestBody AmountRequestDTO req) {
    	 bankAccountService.deposit(req);
    }

    @PostMapping("/withdraw")
    @PreAuthorize("hasRole('BANK')")
    public void withdraw(@RequestBody AmountRequestDTO req) {
    	 bankAccountService.withdraw(req);
    }

}
