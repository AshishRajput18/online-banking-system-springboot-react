package com.backend.repository;

import com.backend.entity.BankAccount;
import com.backend.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {


    
    List<Transaction> findByBankAccount_IdOrderByTransactionDateDesc(Long accountId);
    
    List<Transaction> findByBankAccountIdOrderByTransactionDateDesc(Long bankAccountId);
    List<Transaction> findAllByOrderByTransactionDateDesc();
    List<Transaction> findByBankAccount_AccountNumber(String accountNumber);
//    List<Transaction> findByAccount_AccountNumberOrderByTransactionTimeDesc(String accountNumber);
//    List<Transaction> findByAccount_AccountNumber(String accountNumber);
 // ✅ CORRECT PROPERTY PATH
    List<Transaction> findByBankAccount_AccountNumberOrderByTransactionDateDesc(String accountNumber);
    List<Transaction> findByBankAccount_Customer_IdOrderByTransactionDateDesc(Long customerId);
 // NEW: For bank manager - transactions of their bank
 // NEW: For bank manager - transactions of their bank
    List<Transaction> findByBankAccount_Bank_IdOrderByTransactionDateDesc(Long bankId);
    
    List<Transaction> findBySenderAccountOrReceiverAccount(
            BankAccount senderAccount,
            BankAccount receiverAccount
    );
    
}
