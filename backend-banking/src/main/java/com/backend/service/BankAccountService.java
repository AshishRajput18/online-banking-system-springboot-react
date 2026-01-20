package com.backend.service;

import com.backend.dto.*;
import com.backend.entity.*;
import com.backend.repository.*;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class BankAccountService {

    private final BankManagerRepository bankManagerRepository;
    private final CustomerRepository customerRepository;
    private final BankAccountRepository bankAccountRepository;
    private final TransactionRepository txnRepo;
    

    public BankAccountService(
            BankManagerRepository bankManagerRepository,
            CustomerRepository customerRepository,
            BankAccountRepository bankAccountRepository,
            TransactionRepository txnRepo
    ) {
        this.bankManagerRepository = bankManagerRepository;
        this.customerRepository = customerRepository;
        this.bankAccountRepository = bankAccountRepository;
        this.txnRepo = txnRepo;
    }

    /* ================= FETCH CUSTOMER + BANK INFO ================= */
    public CustomerAccountInfoDTO getCustomerInfo(String managerEmail, String customerEmail) {

        BankManager manager = bankManagerRepository.findByEmail(managerEmail)
                .orElseThrow(() -> new RuntimeException("Manager not found"));

        Bank bank = manager.getBank();
        if (bank == null) {
            throw new RuntimeException("Manager not linked to bank");
        }

        Customer customer = customerRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        CustomerAccountInfoDTO dto = new CustomerAccountInfoDTO();
        dto.setBankName(bank.getBankName());
        dto.setBankCode(bank.getBankCode());
        dto.setCustomerName(customer.getName());
        dto.setCustomerEmail(customer.getEmail());
        dto.setCustomerContact(customer.getContact());

        return dto;
    }

    /* ================= ADD BANK ACCOUNT ================= */
    public void addAccount(String managerEmail, AddAccountRequest request) {

        BankManager manager = bankManagerRepository.findByEmail(managerEmail)
                .orElseThrow(() -> new RuntimeException("Manager not found"));

        Bank bank = manager.getBank();
        if (bank == null) {
            throw new RuntimeException("Manager not linked to bank");
        }

        Customer customer = customerRepository.findByEmail(request.getCustomerEmail())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        if (bankAccountRepository.existsByAccountNumber(request.getAccountNumber())) {
            throw new RuntimeException("Account number already exists");
        }

        BankAccount account = new BankAccount();
        account.setAccountNumber(request.getAccountNumber());
        account.setIfscCode(request.getIfscCode());
        account.setAccountType(request.getAccountType());
        account.setCustomer(customer);
        account.setBank(bank);
        account.setBalance(BigDecimal.ZERO);
        account.setStatus("ACTIVE");
        account.setCreatedOn(LocalDateTime.now());

        bankAccountRepository.save(account);
    }

    /* ================= DEACTIVATE ACCOUNT ================= */
    public String deactivateAccount(String email) {

        BankAccount account = bankAccountRepository.findByCustomer_Email(email)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        account.setStatus("INACTIVE");
        bankAccountRepository.save(account);

        return "Account deactivated successfully";
    }

    /* ================= ACCOUNT DETAILS ================= */
    public AccountDetailResponseDTO getAccountDetail(String email) {

        BankAccount acc = bankAccountRepository.findByCustomer_Email(email)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        AccountDetailResponseDTO dto = new AccountDetailResponseDTO();
        dto.bankName = acc.getBank().getBankName();
        dto.accountNo = acc.getAccountNumber();
        dto.ifsc = acc.getIfscCode();
        dto.customerName = acc.getCustomer().getName();
        dto.contact = acc.getCustomer().getContact();
        dto.createdOn = acc.getCreatedOn();
        dto.balance = acc.getBalance();
        dto.status = acc.getStatus(); // STRING from DB

        return dto;
    }

    /* ================= FETCH TRANSACTIONS ================= */
    public List<TransactionResponseDTO> getTransactions(String email) {

        BankAccount acc = bankAccountRepository.findByCustomer_Email(email)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        return txnRepo
                .findByBankAccount_IdOrderByTransactionDateDesc(acc.getId())
                .stream()
                .map(t -> {
                    TransactionResponseDTO dto = new TransactionResponseDTO();
                    dto.setType(t.getType());
                    dto.setAmount(t.getAmount());
                    dto.setBalance(t.getBalanceAfter());
                    dto.setDate(t.getTransactionDate());
                    return dto;
                })
                .toList();
    }

    /* ================= DEPOSIT ================= */
    public void deposit(AmountRequestDTO req) {

        BankAccount acc = bankAccountRepository.findByCustomer_Email(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Account not found"));

        if ("INACTIVE".equalsIgnoreCase(acc.getStatus())) {
            throw new RuntimeException("Account is inactive. Deposit not allowed");
        }

        acc.setBalance(acc.getBalance().add(req.getAmount()));

        Transaction tx = new Transaction();
        tx.setTransactionId(UUID.randomUUID().toString());
        tx.setType("DEPOSIT");
        tx.setAmount(req.getAmount());
        tx.setBalanceAfter(acc.getBalance());
        tx.setBankAccount(acc);
        tx.setTransactionDate(LocalDateTime.now());

        txnRepo.save(tx);
        bankAccountRepository.save(acc);
    }

    /* ================= WITHDRAW ================= */
    public void withdraw(AmountRequestDTO req) {

        BankAccount acc = bankAccountRepository.findByCustomer_Email(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Account not found"));

        if ("INACTIVE".equalsIgnoreCase(acc.getStatus())) {
            throw new RuntimeException("Account is inactive. Withdraw not allowed");
        }

        if (acc.getBalance().compareTo(req.getAmount()) < 0) {
            throw new RuntimeException("Insufficient balance");
        }

        acc.setBalance(acc.getBalance().subtract(req.getAmount()));

        Transaction tx = new Transaction();
        tx.setTransactionId(UUID.randomUUID().toString());
        tx.setType("WITHDRAW");
        tx.setAmount(req.getAmount());
        tx.setBalanceAfter(acc.getBalance());
        tx.setBankAccount(acc);
        tx.setTransactionDate(LocalDateTime.now());

        txnRepo.save(tx);
        bankAccountRepository.save(acc);
    }
 // ================= LOCK ACCOUNT =================
    public void lockAccount(String accountNumber) {

        BankAccount account = bankAccountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        account.setStatus("INACTIVE"); // ❌ enum removed
        bankAccountRepository.save(account);
    }
    public void unlockAccount(String accountNumber) {
        BankAccount account = bankAccountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        account.setStatus("ACTIVE");
        bankAccountRepository.save(account);
    }

 // ================= FETCH ALL BANK ACCOUNTS =================
    public List<BankAccount> getAllAccounts() {
        return bankAccountRepository.findAll();
    }
    
    // Fetch account by account number
    public BankAccount getAccountByNumber(String accountNumber) {
        return bankAccountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Account not found"));
    }

//    // Fetch transactions for account
//    public List<Transaction> getTransactionsByAccount(String accountNumber) {
//        return txnRepo.findByAccount_AccountNumber(accountNumber);
//    }
 // NEW: For Bank Managers - only their bank's accounts
    public List<BankAccount> getAccountsByBank(Long bankId) {
        return bankAccountRepository.findByBankId(bankId);
    }

}
