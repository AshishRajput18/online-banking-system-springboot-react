package com.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.backend.dto.CustomerTransactionResponseDTO;
import com.backend.dto.TransactionResponseDTO;
import com.backend.entity.BankAccount;
import com.backend.entity.Transaction;
import com.backend.repository.BankAccountRepository;
import com.backend.repository.TransactionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TransactionService {

	@Autowired
    private TransactionRepository transactionRepo;
	@Autowired
    private BankAccountRepository accountRepo;

    public List<CustomerTransactionResponseDTO> getCustomerTransactions(String email, String accountNumber) {
        BankAccount account = accountRepo.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        // Security check: only allow owner
        if (!account.getCustomer().getEmail().equalsIgnoreCase(email)) {
            throw new RuntimeException("Unauthorized access to this account");
        }

        return transactionRepo.findByBankAccountIdOrderByTransactionDateDesc(account.getId())
                .stream()
                .map(tx -> mapToDto(tx, account))
                .collect(Collectors.toList());
    }

    // Bank manager method (unchanged from your working version)
    public List<CustomerTransactionResponseDTO> getBankTransactions(Long bankId) {
        List<BankAccount> accounts = accountRepo.findByBankId(bankId);

        return accounts.stream()
                .flatMap(account -> transactionRepo
                        .findByBankAccountIdOrderByTransactionDateDesc(account.getId())
                        .stream()
                        .map(tx -> mapToDto(tx, account))
                )
                .collect(Collectors.toList());
    }

    private CustomerTransactionResponseDTO mapToDto(Transaction tx, BankAccount account) {
        CustomerTransactionResponseDTO dto = new CustomerTransactionResponseDTO();
        dto.setId(tx.getTransactionId());
        dto.setBank(account.getBank().getBankName());
        dto.setCustomerName(account.getCustomer().getName());
        dto.setAccountNo(account.getAccountNumber());
        dto.setType(tx.getType());
        dto.setAmount(tx.getAmount());
        dto.setBalance(tx.getBalanceAfter());
        dto.setRecipientBank(tx.getRecipientBank() != null ? tx.getRecipientBank() : "-");
        dto.setRecipientAccount(tx.getRecipientAccount() != null ? tx.getRecipientAccount() : "-");
        dto.setPurpose(tx.getPurpose() != null ? tx.getPurpose() : "-");
        dto.setDate(tx.getTransactionDate());
        return dto;
    }
    

    // Fetch all transactions or by account number
    public List<TransactionResponseDTO> getTransactions(String accountNumber) {
        List<Transaction> transactions;

        if (accountNumber != null && !accountNumber.isEmpty()) {
            // Fetch only transactions for specific account
            transactions = transactionRepo.findByBankAccount_AccountNumber(accountNumber);
        } else {
            // Fetch all transactions
            transactions = transactionRepo.findAll();
        }

        return transactions.stream().map(tx -> {
            TransactionResponseDTO dto = new TransactionResponseDTO();
            dto.setId(tx.getId());
            dto.setTransactionId(tx.getTransactionId());
            dto.setType(tx.getType());
            dto.setAmount(tx.getAmount());
            dto.setBalance(tx.getBalanceAfter());
            dto.setDate(tx.getTransactionDate());
            dto.setBankName(tx.getBankAccount() != null ? tx.getBankAccount().getBank().getBankName() : null);
            dto.setCustomerName(tx.getBankAccount() != null && tx.getBankAccount().getCustomer() != null
                    ? tx.getBankAccount().getCustomer().getName()
                    : null);
            dto.setAccountNumber(tx.getBankAccount() != null ? tx.getBankAccount().getAccountNumber() : null);
            dto.setRecipientBank(tx.getRecipientBank());
            dto.setRecipientAccount(tx.getRecipientAccount());
            dto.setPurpose(tx.getPurpose());
            return dto;
        }).collect(Collectors.toList());
    }

    
    
}