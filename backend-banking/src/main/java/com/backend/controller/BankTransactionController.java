package com.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.backend.dto.CustomerTransactionResponseDTO;
import com.backend.service.TransactionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/bank")
@RequiredArgsConstructor
@CrossOrigin
public class BankTransactionController {

	@Autowired
    private  TransactionService transactionService;

    @GetMapping("/transactions")
    public List<CustomerTransactionResponseDTO> getBankTransactions(@RequestParam Long bankId) {
        return transactionService.getBankTransactions(bankId);
    }
}
