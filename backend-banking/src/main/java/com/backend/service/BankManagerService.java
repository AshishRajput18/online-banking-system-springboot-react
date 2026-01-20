package com.backend.service;

import com.backend.dto.BankManagerResponseDTO;
import com.backend.entity.Bank;
import com.backend.entity.BankManager;
import com.backend.repository.BankManagerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BankManagerService {

    private final BankManagerRepository bankManagerRepository;

    public BankManagerService(BankManagerRepository bankManagerRepository) {
        this.bankManagerRepository = bankManagerRepository;
    }

    public List<BankManagerResponseDTO> getAllManager() {
        return bankManagerRepository.findAll().stream().map(manager -> {
            BankManagerResponseDTO dto = new BankManagerResponseDTO();

            // 🔗 Bank relation (important)
            Bank bank = manager.getBank();
            dto.setBankName(bank != null ? bank.getBankName() : "N/A");

            dto.setName(manager.getName());
            dto.setEmail(manager.getEmail());
            dto.setGender(manager.getGender());
            dto.setContact(manager.getContactNo());
            dto.setStreet(manager.getStreet());
            dto.setCity(manager.getCity());
            dto.setPincode(manager.getPincode());

            return dto;
        }).toList();
    }
}
