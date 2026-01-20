package com.backend.service;

import com.backend.dto.BankManagerDTO;
import com.backend.dto.BankManagerRequest;
import com.backend.entity.Admin;
import com.backend.entity.BankManager;
import com.backend.repository.AdminRepository;
import com.backend.repository.BankManagerRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final AdminRepository repo;
    private final PasswordEncoder encoder;
    private final BankManagerRepository bankRepo;

    public AdminService(BankManagerRepository bankRepo, AdminRepository repo, PasswordEncoder encoder) {
        this.repo = repo;
        this.encoder = encoder;
        this.bankRepo = bankRepo;
    }

    // Register Admin
    public Admin register(String email, String password) {
        Admin admin = new Admin();
        admin.setEmail(email);
        admin.setPassword(encoder.encode(password));
        return repo.save(admin);
    }

    // Register Bank Manager
    public void registerBankManager(BankManagerRequest request, String adminEmail) {
        Admin admin = repo.findByEmail(adminEmail)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        BankManager manager = new BankManager();
        manager.setName(request.getName());
        manager.setEmail(request.getEmail());
        manager.setPassword(encoder.encode(request.getPassword()));
        manager.setGender(request.getGender());
        manager.setContactNo(request.getContactNo());
        manager.setAge(request.getAge());
        manager.setStreet(request.getStreet());
        manager.setCity(request.getCity());
        manager.setPincode(request.getPincode());
        manager.setAdmin(admin); // ✅ automatically link admin
        manager.setRole("BANK");

        bankRepo.save(manager);
    }

    // Fetch all bank managers (DTO)
    public List<BankManagerDTO> getAllBankManagers() {
        return bankRepo.findAll()
                .stream()
                .map(manager -> new BankManagerDTO(
                        manager.getId(),
                        manager.getName(),
                        manager.getEmail()
                ))
                .collect(Collectors.toList());
    }
}
