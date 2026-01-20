package com.backend.service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.backend.dto.TransferRequest;
import com.backend.entity.BankAccount;
import com.backend.entity.Transaction;
import com.backend.repository.BankAccountRepository;
import com.backend.repository.TransactionRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class TransferService {

    private final BankAccountRepository bankAccountRepo;
    private final TransactionRepository transactionRepo;

    public TransferService(BankAccountRepository bankAccountRepo,
                           TransactionRepository transactionRepo) {
        this.bankAccountRepo = bankAccountRepo;
        this.transactionRepo = transactionRepo;
    }

    public void transferMoney(TransferRequest req) {

        // ================= FETCH ACCOUNTS =================
        BankAccount sender = bankAccountRepo
                .findByAccountNumber(req.getSenderAccountNumber())
                .orElseThrow(() -> new RuntimeException("Sender account not found"));

        BankAccount receiver = bankAccountRepo
                .findByAccountNumberAndIfscCode(
                        req.getReceiverAccountNumber(),
                        req.getIfscCode())
                .orElseThrow(() -> new RuntimeException("Receiver account not found"));

        // ================= NEW CHECK: Receiver must be ACTIVE =================
        if (!"ACTIVE".equals(receiver.getStatus())) {
            throw new RuntimeException("Cannot transfer to inactive account");
        }

        // ================= BALANCE CHECK =================
        if (sender.getBalance().compareTo(req.getAmount()) < 0) {
            throw new RuntimeException("Insufficient balance");
        }

        // ================= Also good to check sender status (optional but recommended) =================
        if (!"ACTIVE".equals(sender.getStatus())) {
            throw new RuntimeException("Your account is inactive. Cannot perform transfer");
        }

        // ================= UPDATE BALANCES =================
        sender.setBalance(sender.getBalance().subtract(req.getAmount()));
        receiver.setBalance(receiver.getBalance().add(req.getAmount()));

        bankAccountRepo.save(sender);
        bankAccountRepo.save(receiver);

        // ================= SAVE TRANSACTION (SENDER) =================
        Transaction senderTx = new Transaction();
        senderTx.setTransactionId(UUID.randomUUID().toString());
        senderTx.setType("TRANSFER");
        senderTx.setAmount(req.getAmount());
        senderTx.setBalanceAfter(sender.getBalance());
        senderTx.setRecipientAccount(receiver.getAccountNumber());
        senderTx.setRecipientBank(receiver.getBank().getBankName());
        senderTx.setPurpose(req.getPurpose());
        senderTx.setBankAccount(sender);
        senderTx.setTransactionDate(LocalDateTime.now());

        transactionRepo.save(senderTx);

        // ================= SAVE TRANSACTION (RECEIVER) =================
        Transaction receiverTx = new Transaction();
        receiverTx.setTransactionId(UUID.randomUUID().toString());
        receiverTx.setType("DEPOSIT");
        receiverTx.setAmount(req.getAmount());
        receiverTx.setBalanceAfter(receiver.getBalance());
        receiverTx.setRecipientAccount(sender.getAccountNumber());
        receiverTx.setRecipientBank(sender.getBank().getBankName());
        receiverTx.setPurpose("Received from " + sender.getAccountNumber());
        receiverTx.setBankAccount(receiver);
        receiverTx.setTransactionDate(LocalDateTime.now());

        transactionRepo.save(receiverTx);
    }
}