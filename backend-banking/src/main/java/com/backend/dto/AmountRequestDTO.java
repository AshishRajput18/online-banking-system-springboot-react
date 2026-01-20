package com.backend.dto;

import java.math.BigDecimal;

public class AmountRequestDTO {
    public String email;
    public BigDecimal amount;
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public BigDecimal getAmount() {
		return amount;
	}
	public void setAmount(BigDecimal amount) {
		this.amount = amount;
	}
    
}
