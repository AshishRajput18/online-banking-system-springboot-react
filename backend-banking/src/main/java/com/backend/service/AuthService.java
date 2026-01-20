package com.backend.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.backend.config.JwtUtil;
import com.backend.dto.LoginRequest;
import com.backend.dto.LoginResponse;
import com.backend.entity.Admin;
import com.backend.entity.BankManager;
import com.backend.entity.Customer;
import com.backend.repository.AdminRepository;
import com.backend.repository.BankManagerRepository;
import com.backend.repository.CustomerRepository;

@Service
public class AuthService {

    private final AdminRepository adminRepo;
    private final BankManagerRepository bankRepo;
    private final CustomerRepository customerRepo;
    private final PasswordEncoder encoder;
    private final JwtUtil jwtUtil;

    public AuthService(
            AdminRepository adminRepo,
            BankManagerRepository bankRepo,
            CustomerRepository customerRepo,
            PasswordEncoder encoder,
            JwtUtil jwtUtil) {

        this.adminRepo = adminRepo;
        this.bankRepo = bankRepo;
        this.customerRepo = customerRepo;
        this.encoder = encoder;
        this.jwtUtil = jwtUtil;
    }

    public LoginResponse login(LoginRequest request) {

        String role = request.getRole().toUpperCase();

        switch (role) {

            /* ================= ADMIN LOGIN ================= */
            case "ADMIN" -> {
                Admin admin = adminRepo.findByEmail(request.getEmail())
                        .orElseThrow(() -> new RuntimeException("Admin not found"));

                if (!encoder.matches(request.getPassword(), admin.getPassword())) {
                    throw new RuntimeException("Invalid password");
                }

                String token = jwtUtil.generateToken(admin.getEmail(), "ADMIN");

                return new LoginResponse(
                        token,
                        "ADMIN",
                        admin.getEmail(),
                        null,
                        null
                );
            }

            /* ================= BANK LOGIN ================= */
            case "BANK" -> {
                BankManager bank = bankRepo.findByEmail(request.getEmail())
                        .orElseThrow(() -> new RuntimeException("Bank manager not found"));

                if (!encoder.matches(request.getPassword(), bank.getPassword())) {
                    throw new RuntimeException("Invalid password");
                }

                String token = jwtUtil.generateToken(bank.getEmail(), "BANK");

                return new LoginResponse(
                        token,
                        "BANK",
                        bank.getEmail(),
                        null,
                        bank.getBank().getId() // ✅ bankId returned
                );
            }

            /* ================= CUSTOMER LOGIN ================= */
            case "CUSTOMER" -> {
                Customer customer = customerRepo.findByEmail(request.getEmail())
                        .orElseThrow(() -> new RuntimeException("Customer not found"));

                if (!encoder.matches(request.getPassword(), customer.getPassword())) {
                    throw new RuntimeException("Invalid password");
                }

                if (customer.getBankAccount() == null) {
                    throw new RuntimeException("Customer has no bank account");
                }

                String token = jwtUtil.generateToken(customer.getEmail(), "CUSTOMER");

                return new LoginResponse(
                        token,
                        "CUSTOMER",
                        customer.getEmail(),
                        customer.getBankAccount().getAccountNumber(), // ✅ accountNumber
                        null
                );
            }

            default -> throw new RuntimeException("Invalid role");
        }
    }
}
