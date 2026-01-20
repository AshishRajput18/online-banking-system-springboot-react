package com.backend.service;

import com.backend.dto.AddBankRequest;
import com.backend.dto.BankResponseDTO;
import com.backend.entity.Admin;
import com.backend.entity.Bank;
import com.backend.entity.BankManager;
import com.backend.entity.BankAccount;
import com.backend.repository.AdminRepository;
import com.backend.repository.BankManagerRepository;
import com.backend.repository.BankRepository;
import com.backend.repository.BankAccountRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class BankService {

    private final BankRepository bankRepository;
    private final BankManagerRepository bankManagerRepository;
    private final AdminRepository adminRepository;
    private final BankAccountRepository bankAccountRepository; // 🔹 Inject repository

    public BankService(
            BankRepository bankRepository,
            BankManagerRepository bankManagerRepository,
            AdminRepository adminRepository,
            BankAccountRepository bankAccountRepository
    ) {
        this.bankRepository = bankRepository;
        this.bankManagerRepository = bankManagerRepository;
        this.adminRepository = adminRepository;
        this.bankAccountRepository = bankAccountRepository;
    }

    // ✅ GET ALL BANKS
    public List<BankResponseDTO> getAllBanks() {
        return bankRepository.findAll().stream().map(bank -> {
            BankResponseDTO dto = new BankResponseDTO();
            dto.setName(bank.getBankName());
            dto.setCode(bank.getBankCode());
            dto.setAddress(bank.getBankAddress());
            dto.setPhone(bank.getPhoneNumber());
            dto.setEmail(bank.getBankEmail());
            dto.setWebsite(bank.getWebsite());
            dto.setCountry(bank.getCountry());
            dto.setCurrency(bank.getCurrency());
            return dto;
        }).toList();
    }

    // ✅ ADD BANK
    public void addBank(AddBankRequest request, String adminEmail) {

        if (adminEmail == null || adminEmail.equals("anonymousUser")) {
            throw new RuntimeException("Invalid admin email from JWT");
        }

        // ✅ Find Admin
        Admin admin = adminRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        // ✅ Find Bank Manager
        BankManager manager = bankManagerRepository
                .findById(request.getBankManagerId())
                .orElseThrow(() -> new RuntimeException("Bank Manager not found"));

        // ❌ Prevent double assignment
        if (manager.getBank() != null) {
            throw new RuntimeException("Bank Manager already assigned to a bank");
        }

        // ✅ Create Bank
        Bank bank = new Bank();
        bank.setBankName(request.getBankName());
        bank.setBankCode(request.getBankCode());
        bank.setWebsite(request.getWebsite());
        bank.setBankAddress(request.getBankAddress());
        bank.setBankEmail(request.getBankEmail());
        bank.setPhoneNumber(request.getPhoneNumber());
        bank.setCountry(request.getCountry());
        bank.setCurrency(request.getCurrency());

        // ✅ SET RELATIONSHIPS (BOTH SIDES)
        bank.setAdmin(admin);
        bank.setBankManager(manager);
        manager.setBank(bank); // 🔹 important

        // ✅ Save entities
        bankRepository.save(bank);
        bankManagerRepository.save(manager);
    }

    // 🔹 DEACTIVATE CUSTOMER BANK ACCOUNT
    public boolean deactivateAccount(String customerEmail) {
        Optional<BankAccount> accountOpt = bankAccountRepository.findByCustomer_Email(customerEmail);

        if (accountOpt.isPresent() && accountOpt.get().getStatus().equalsIgnoreCase("ACTIVE")) {
            BankAccount account = accountOpt.get();
            account.setStatus("INACTIVE");
            bankAccountRepository.save(account);
            return true;
        }

        return false;
    }
}
