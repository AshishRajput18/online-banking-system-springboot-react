package com.backend.repository;

import com.backend.entity.BankAccount;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BankAccountRepository extends JpaRepository<BankAccount, Long> {

    // ✅ Prevent duplicate account numbers
    boolean existsByAccountNumber(String accountNumber);

    // ✅ Fetch account using customer email
    Optional<BankAccount> findByCustomer_Email(String email);

    // ✅ Check if customer already has ANY account
    boolean existsByCustomer_Email(String email);

    // ✅ Check if customer has ACTIVE account
    boolean existsByCustomer_EmailAndStatus(String email, String status);
    
    Optional<BankAccount> findByCustomerEmail(String email);
    
    Optional<BankAccount> findByAccountNumber(String accountNumber);
    List<BankAccount> findAll();
    Optional<BankAccount> findByCustomerId(Long customerId);
    
    Optional<BankAccount> findByAccountNumberAndIfscCode(
            String accountNumber, String ifscCode);


 // Existing methods...
    List<BankAccount> findByBankId(Long bankId);
    Optional<BankAccount> findByAccountNumberAndBank_Id(
            String accountNumber,
            Long bankId
    );
    List<BankAccount> findByBank_Id(Long bankId);
    
    
}
