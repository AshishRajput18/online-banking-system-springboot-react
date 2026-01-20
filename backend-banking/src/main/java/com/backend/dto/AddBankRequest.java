package com.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddBankRequest {

    private String bankName;
    private String bankCode;
    private String website;
    private String bankAddress;
    private String bankEmail;
    private String phoneNumber;
    private String country;
    private String currency;

    // ✅ MUST BE ID, not name
    private Long bankManagerId;

	public String getBankName() {
		return bankName;
	}

	public void setBankName(String bankName) {
		this.bankName = bankName;
	}

	public String getBankCode() {
		return bankCode;
	}

	public void setBankCode(String bankCode) {
		this.bankCode = bankCode;
	}

	public String getWebsite() {
		return website;
	}

	public void setWebsite(String website) {
		this.website = website;
	}

	public String getBankAddress() {
		return bankAddress;
	}

	public void setBankAddress(String bankAddress) {
		this.bankAddress = bankAddress;
	}

	public String getBankEmail() {
		return bankEmail;
	}

	public void setBankEmail(String bankEmail) {
		this.bankEmail = bankEmail;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

	public String getCurrency() {
		return currency;
	}

	public void setCurrency(String currency) {
		this.currency = currency;
	}

	public Long getBankManagerId() {
		return bankManagerId;
	}

	public void setBankManagerId(Long bankManagerId) {
		this.bankManagerId = bankManagerId;
	}
    
    
}
