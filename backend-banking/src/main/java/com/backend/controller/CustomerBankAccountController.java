package com.backend.controller;

import com.backend.entity.BankAccount;
import com.backend.entity.Transaction;
import com.backend.service.BankAccountService;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer")
@CrossOrigin(origins = "http://localhost:5173") 

// React dev server
public class CustomerBankAccountController {

    private final BankAccountService accountService;

    public CustomerBankAccountController(BankAccountService accountService) {
        this.accountService = accountService;
    }

    // Get account details
    @GetMapping("/account/{accountNo}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public BankAccount getAccount(@PathVariable String accountNo) {
        return accountService.getAccountByNumber(accountNo);
    }

//    // Get transactions for account
//    @GetMapping("/transactions/{accountNo}")
//    public List<Transaction> getTransactions(@PathVariable String accountNo) {
//        return accountService.getTransactionsByAccount(accountNo);
//    }
}
