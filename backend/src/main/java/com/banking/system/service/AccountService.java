package com.banking.system.service;

import com.banking.system.dto.AccountCreateRequest;
import com.banking.system.dto.TransactionRequest;
import com.banking.system.model.Account;
import com.banking.system.model.Transaction;
import com.banking.system.model.TransactionType;
import com.banking.system.repository.AccountRepository;
import com.banking.system.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

/**
 * Service class handling the core banking logic and transactions.
 * Utilizes Spring's @Transactional to ensure ACID compliance during money transfers.
 */
@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    /**
     * Creates a new account with a unique account number and initial balance.
     */
    @Transactional
    public Account createAccount(AccountCreateRequest request) {
        Account account = new Account();
        account.setAccountNumber(generateAccountNumber());
        account.setCustomerName(request.getCustomerName());
        account.setBalance(request.getInitialBalance() != null ? request.getInitialBalance() : BigDecimal.ZERO);
        return accountRepository.save(account);
    }

    /**
     * Retrieves an account by its account number.
     */
    public Account getAccount(String accountNumber) {
        return accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Account not found with account number: " + accountNumber));
    }

    /**
     * Deposits an amount into an account and records the transaction.
     * Transactional annotation ensures both the balance update and the transaction record succeed together.
     */
    @Transactional
    public Account deposit(TransactionRequest request) {
        Account account = getAccount(request.getAccountNumber());
        account.setBalance(account.getBalance().add(request.getAmount()));
        
        Transaction transaction = new Transaction();
        transaction.setAccount(account);
        transaction.setAmount(request.getAmount());
        transaction.setType(TransactionType.DEPOSIT);
        
        transactionRepository.save(transaction);
        return accountRepository.save(account);
    }

    /**
     * Withdraws an amount from an account if there are sufficient funds.
     */
    @Transactional
    public Account withdraw(TransactionRequest request) {
        Account account = getAccount(request.getAccountNumber());
        
        if (account.getBalance().compareTo(request.getAmount()) < 0) {
            throw new RuntimeException("Insufficient funds for withdrawal");
        }
        
        account.setBalance(account.getBalance().subtract(request.getAmount()));
        
        Transaction transaction = new Transaction();
        transaction.setAccount(account);
        transaction.setAmount(request.getAmount());
        transaction.setType(TransactionType.WITHDRAWAL);
        
        transactionRepository.save(transaction);
        return accountRepository.save(account);
    }
    
    /**
     * Fetches all transactions for a given account.
     */
    public List<Transaction> getTransactions(String accountNumber) {
        Account account = getAccount(accountNumber);
        return transactionRepository.findByAccountIdOrderByTransactionDateDesc(account.getId());
    }

    /**
     * Fetches all accounts.
     */
    public List<Account> getAllAccounts() {
        return accountRepository.findAll();
    }
    
    private String generateAccountNumber() {
        // Generating a simple 10-digit account number analog.
        return String.valueOf(Math.abs(UUID.randomUUID().getMostSignificantBits())).substring(0, 10);
    }
}
