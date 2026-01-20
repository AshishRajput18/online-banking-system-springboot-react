package com.backend.entity;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "banks")
public class Bank {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String bankName;
    private String bankCode;
    private String website;
    private String bankAddress;
    private String bankEmail;
    private String phoneNumber;
    private String country;
    private String currency;

    // ✅ Admin (from JWT)
 // MANY BANKS → ONE ADMIN
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id", nullable = false)
    @JsonIgnore
    private Admin admin;

    // ✅ Bank Manager (from dropdown)
    @JsonIgnore
    @OneToOne
    @JoinColumn(name = "bank_manager_id", nullable = false)
    private BankManager bankManager;
    
    @JsonIgnore
    @OneToMany(mappedBy = "bank", cascade = CascadeType.ALL)
    private List<Customer> customers;
    
    
    // ✅ Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getBankName() { return bankName; }
    public void setBankName(String bankName) { this.bankName = bankName; }
    public String getBankCode() { return bankCode; }
    public void setBankCode(String bankCode) { this.bankCode = bankCode; }
    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }
    public String getBankAddress() { return bankAddress; }
    public void setBankAddress(String bankAddress) { this.bankAddress = bankAddress; }
    public String getBankEmail() { return bankEmail; }
    public void setBankEmail(String bankEmail) { this.bankEmail = bankEmail; }
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public Admin getAdmin() { return admin; }
    public void setAdmin(Admin admin) { this.admin = admin; }
    public BankManager getBankManager() { return bankManager; }
    public void setBankManager(BankManager bankManager) { this.bankManager = bankManager; }
	public List<Customer> getCustomers() {
		return customers;
	}
	public void setCustomers(List<Customer> customers) {
		this.customers = customers;
	}
    
    
}
