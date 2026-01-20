package com.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.backend.dto.TransactionResponseDTO;
import com.backend.service.TransactionService;

@RestController
@RequestMapping("/api/customer")
@CrossOrigin(origins = "http://localhost:5173")
public class CustomerTransactionController {

    private final TransactionService transactionService;

    public CustomerTransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

 // Fetch transactions (all or by account number)
    @GetMapping("/transactions")
    public List<TransactionResponseDTO> getTransactions(
            @RequestParam(required = false) String accountNumber
    ) {
        return transactionService.getTransactions(accountNumber);
    }
}
