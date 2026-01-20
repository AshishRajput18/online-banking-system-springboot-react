package com.backend.dto;

public class LoginResponse {

    private String token;
    private String role;
    private String email;

    private String accountNumber; // for CUSTOMER
    private Long bankId;          // for BANK

    public LoginResponse() {
    }

    public LoginResponse(
            String token,
            String role,
            String email,
            String accountNumber,
            Long bankId
    ) {
        this.token = token;
        this.role = role;
        this.email = email;
        this.accountNumber = accountNumber;
        this.bankId = bankId;
    }

    // ================= GETTERS & SETTERS =================

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public Long getBankId() {
        return bankId;
    }

    public void setBankId(Long bankId) {
        this.bankId = bankId;
    }
}
