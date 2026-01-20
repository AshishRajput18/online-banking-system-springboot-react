package com.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "bank_managers")
public class BankManager {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @JsonIgnore
    @Column(nullable = false)
    private String password;

    private String gender;

    @Column(length = 15)
    private String contactNo;

    private Integer age;

    private String street;
    private String city;

    @Column(length = 10)
    private String pincode;

    @Column(nullable = false)
    private String role = "BANK";

    // ================= RELATIONSHIPS =================

    /**
     * MANY bank managers can be created by ONE admin
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id")
    @JsonIgnore
    private Admin admin;

    /**
     * ONE bank manager manages ONE bank
     * (Bank owns the relationship)
     */
    @OneToOne(mappedBy = "bankManager", fetch = FetchType.LAZY)
    @JsonIgnore
    private Bank bank;
    
    @OneToOne
    @JsonIgnore
    @JoinColumn(name = "bank_manager_id")
    private BankManager bankManager;


    // ================= GETTERS & SETTERS =================

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getContactNo() { return contactNo; }
    public void setContactNo(String contactNo) { this.contactNo = contactNo; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getStreet() { return street; }
    public void setStreet(String street) { this.street = street; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Admin getAdmin() { return admin; }
    public void setAdmin(Admin admin) { this.admin = admin; }

    public Bank getBank() { return bank; }
    public void setBank(Bank bank) { this.bank = bank; }
}
