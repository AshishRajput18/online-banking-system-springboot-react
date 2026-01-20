package com.backend.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.backend.entity.BankManager;

public interface BankManagerRepository extends JpaRepository<BankManager, Long> {
    Optional<BankManager> findByEmail(String email);
    Optional<BankManager> findByName(String name);
}
