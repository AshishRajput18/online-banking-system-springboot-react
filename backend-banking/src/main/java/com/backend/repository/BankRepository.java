package com.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.entity.Bank;

public interface BankRepository extends JpaRepository<Bank, Long> {
}
