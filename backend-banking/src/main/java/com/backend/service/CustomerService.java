package com.backend.service;

import com.backend.dto.CustomerListResponseDTO;
import com.backend.dto.CustomerRegisterRequest;
import com.backend.entity.Bank;
import com.backend.entity.BankAccount;
import com.backend.entity.BankManager;
import com.backend.entity.Customer;
import com.backend.repository.BankManagerRepository;
import com.backend.repository.CustomerRepository;
import com.backend.repository.BankAccountRepository;

import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class CustomerService {

    private final BankManagerRepository bankManagerRepository;
    private final CustomerRepository customerRepository;
    private final BankAccountRepository bankAccountRepository;
    private final PasswordEncoder passwordEncoder;

    public CustomerService(BankManagerRepository bankManagerRepository,
                           CustomerRepository customerRepository,
                           BankAccountRepository bankAccountRepository,
                           PasswordEncoder passwordEncoder) {
        this.bankManagerRepository = bankManagerRepository;
        this.customerRepository = customerRepository;
        this.bankAccountRepository = bankAccountRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // 🔹 REGISTER CUSTOMER
    public void registerCustomer(CustomerRegisterRequest request, String managerEmail) {
        BankManager manager = bankManagerRepository.findByEmail(managerEmail)
                .orElseThrow(() -> new RuntimeException("Bank Manager not found"));

        Bank bank = manager.getBank();
        if (bank == null) throw new RuntimeException("Manager is not linked with any bank");

        if (customerRepository.existsByEmail(request.getEmail()))
            throw new RuntimeException("Customer already exists");

        Customer customer = new Customer();
        customer.setName(request.getName());
        customer.setEmail(request.getEmail());
        customer.setPassword(passwordEncoder.encode(request.getPassword()));
        customer.setGender(request.getGender());
        customer.setContact(request.getContact());
        customer.setAge(request.getAge());
        customer.setStreet(request.getStreet());
        customer.setCity(request.getCity());
        customer.setPincode(request.getPincode());
        customer.setBank(bank);
        customer.setStatus("INACTIVE");

        customerRepository.save(customer);
    }

 // Service
    public List<CustomerListResponseDTO> getAllCustomers(String managerEmail) {
        BankManager manager = bankManagerRepository.findByEmail(managerEmail)
                .orElseThrow(() -> new RuntimeException("Bank Manager not found"));

        Bank bank = manager.getBank();
        if (bank == null)
            throw new RuntimeException("Manager not linked with any bank");

        List<Customer> customers = customerRepository.findByBank(bank);

        return customers.stream().map(c -> {
            CustomerListResponseDTO dto = new CustomerListResponseDTO();
            dto.setName(c.getName());
            dto.setBank(bank.getBankName());
            dto.setEmail(c.getEmail());
            dto.setGender(c.getGender());
            dto.setContact(c.getContact());
            dto.setStreet(c.getStreet());
            dto.setCity(c.getCity());
            dto.setPincode(c.getPincode());

            // ✅ Get real account status
            Optional<BankAccount> account = bankAccountRepository.findByCustomer_Email(c.getEmail());
            dto.setStatus(account.map(BankAccount::getStatus).orElse("INACTIVE"));

            return dto;
        }).toList();
    }



    // 🔹 DELETE CUSTOMER
    public void deleteCustomer(String email) {
        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        // 🔹 Optional: delete customer's bank account first
        bankAccountRepository.findByCustomer_Email(email).ifPresent(bankAccountRepository::delete);

        customerRepository.delete(customer);
    }
    
    public List<CustomerListResponseDTO> getAllCustomers() {

        List<Customer> customers = customerRepository.findAll();

        return customers.stream().map(c -> {
            CustomerListResponseDTO dto = new CustomerListResponseDTO();
            dto.setName(c.getName());
            dto.setBank(c.getBank().getBankName());
            dto.setEmail(c.getEmail());
            dto.setGender(c.getGender());
            dto.setContact(c.getContact());
            dto.setStreet(c.getStreet());
            dto.setCity(c.getCity());
            dto.setPincode(c.getPincode());
            

            // ✅ REAL account status (LOCK / UNLOCK reflected)
            Optional<BankAccount> account =
                    bankAccountRepository.findByCustomer_Email(c.getEmail());

            if (account.isPresent()) {
                BankAccount acc = account.get();

                dto.setAccountNo(acc.getAccountNumber());
                dto.setIfsc(acc.getIfscCode());
                dto.setBalance(acc.getBalance().toString());
                dto.setStatus(acc.getStatus()); // ACTIVE / INACTIVE / LOCKED
            } else {
                dto.setAccountNo("-");
                dto.setIfsc("-");
                dto.setBalance("-");
                dto.setStatus("INACTIVE");
            }


            return dto;
        }).toList();
    }

}
