package com.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.backend.entity.BankManager;
import com.backend.repository.BankManagerRepository;

@Service
public class UserService {

    @Autowired
    private BankManagerRepository bankManagerRepo;

    public BankManager getBankManagerByEmail(String email) {
        return bankManagerRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Bank manager not found"));
    }
}
