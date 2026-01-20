package com.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.dto.CustomerListResponseDTO;
import com.backend.entity.BankAccount;
import com.backend.entity.BankManager;
import com.backend.repository.BankManagerRepository;
import com.backend.service.BankAccountService;
import com.backend.service.CustomerService;
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAnyAuthority('ADMIN', 'BANK')") // allow both roles
@CrossOrigin(origins = "*")
public class AdminBankAccountController {

    private final BankAccountService accountService;
    private final CustomerService customerService;
    private final BankManagerRepository bankManagerRepository; // to get current manager's bank

    @Autowired
    public AdminBankAccountController(BankAccountService accountService,
                                      CustomerService customerService,
                                      BankManagerRepository bankManagerRepository) {
        this.accountService = accountService;
        this.customerService = customerService;
        this.bankManagerRepository = bankManagerRepository;
    }

    // ================= FETCH ALL BANK ACCOUNTS =================
    @GetMapping("/accounts")
    public List<BankAccount> getAccounts() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName(); // email or username

        // If ADMIN → return all accounts
        if (auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            return accountService.getAllAccounts();
        }

        // If BANK MANAGER → return only their bank's accounts
        return bankManagerRepository.findByEmail(username)
                .map(manager -> accountService.getAccountsByBank(manager.getBank().getId()))
                .orElseGet(() -> List.of()); // safe fallback: empty list if manager not found
    }
//    @GetMapping("/accounts")
//    public List<BankAccount> getAccounts() {
//        return accountService.getAllAccounts(); // ignore roles temporarily
//    }


    // Lock & Unlock remain the same (you can add ownership check later if needed)
    @PutMapping("/lock/{accountNumber}")
    public ResponseEntity<String> lockAccount(@PathVariable String accountNumber) {
        accountService.lockAccount(accountNumber);
        return ResponseEntity.ok("Account locked successfully");
    }

    @PutMapping("/unlock/{accountNumber}")
    public ResponseEntity<String> unlockAccount(@PathVariable String accountNumber) {
        accountService.unlockAccount(accountNumber);
        return ResponseEntity.ok("Account unlocked successfully");
    }

    // Customers endpoint - can also be filtered similarly if needed
    @GetMapping("/customers")
    public ResponseEntity<List<CustomerListResponseDTO>> getAllCustomers() {
        // For now returning all - you can apply similar filtering later
        List<CustomerListResponseDTO> customers = customerService.getAllCustomers();
        return ResponseEntity.ok(customers);
    }
}