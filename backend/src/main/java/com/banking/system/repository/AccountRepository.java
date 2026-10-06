package com.banking.system.repository;

import com.banking.system.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Data Access interface for Account entity.
 * Abstracts away the boilerplate standard CRUD methods provided by Spring Data JPA.
 */
@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    Optional<Account> findByAccountNumber(String accountNumber);
}
