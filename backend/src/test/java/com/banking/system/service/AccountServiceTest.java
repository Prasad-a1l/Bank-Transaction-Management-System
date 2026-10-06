package com.banking.system.service;

import com.banking.system.dto.AccountCreateRequest;
import com.banking.system.dto.TransactionRequest;
import com.banking.system.model.Account;
import com.banking.system.model.Transaction;
import com.banking.system.repository.AccountRepository;
import com.banking.system.repository.TransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for the AccountService class, using Mockito to mock repository interactions.
 */
@ExtendWith(MockitoExtension.class)
public class AccountServiceTest {

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private TransactionRepository transactionRepository;

    @InjectMocks
    private AccountService accountService;

    private Account testAccount;

    @BeforeEach
    void setUp() {
        testAccount = new Account();
        testAccount.setId(1L);
        testAccount.setAccountNumber("1234567890");
        testAccount.setCustomerName("Test User");
        testAccount.setBalance(new BigDecimal("500.00"));
    }

    @Test
    void testCreateAccount() {
        AccountCreateRequest request = new AccountCreateRequest();
        request.setCustomerName("New User");
        request.setInitialBalance(new BigDecimal("1000.00"));
        
        when(accountRepository.save(any(Account.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Account createdAccount = accountService.createAccount(request);
        
        assertNotNull(createdAccount.getAccountNumber());
        assertEquals("New User", createdAccount.getCustomerName());
        assertEquals(new BigDecimal("1000.00"), createdAccount.getBalance());
        verify(accountRepository, times(1)).save(any(Account.class));
    }

    @Test
    void testDeposit_Success() {
        TransactionRequest request = new TransactionRequest();
        request.setAccountNumber("1234567890");
        request.setAmount(new BigDecimal("200.00"));

        when(accountRepository.findByAccountNumber("1234567890")).thenReturn(Optional.of(testAccount));
        when(accountRepository.save(any(Account.class))).thenReturn(testAccount);
        when(transactionRepository.save(any(Transaction.class))).thenReturn(new Transaction());

        Account updatedAccount = accountService.deposit(request);

        assertEquals(new BigDecimal("700.00"), updatedAccount.getBalance(), "Balance should increase by 200");
        verify(transactionRepository, times(1)).save(any(Transaction.class));
        verify(accountRepository, times(1)).save(testAccount);
    }

    @Test
    void testWithdraw_Success() {
        TransactionRequest request = new TransactionRequest();
        request.setAccountNumber("1234567890");
        request.setAmount(new BigDecimal("100.00"));

        when(accountRepository.findByAccountNumber("1234567890")).thenReturn(Optional.of(testAccount));
        when(accountRepository.save(any(Account.class))).thenReturn(testAccount);
        when(transactionRepository.save(any(Transaction.class))).thenReturn(new Transaction());

        Account updatedAccount = accountService.withdraw(request);

        assertEquals(new BigDecimal("400.00"), updatedAccount.getBalance(), "Balance should decrease by 100");
        verify(transactionRepository, times(1)).save(any(Transaction.class));
        verify(accountRepository, times(1)).save(testAccount);
    }

    @Test
    void testWithdraw_InsufficientFunds_ThrowsException() {
        TransactionRequest request = new TransactionRequest();
        request.setAccountNumber("1234567890");
        request.setAmount(new BigDecimal("1000.00")); // More than balance 500

        when(accountRepository.findByAccountNumber("1234567890")).thenReturn(Optional.of(testAccount));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            accountService.withdraw(request);
        });

        assertEquals("Insufficient funds for withdrawal", exception.getMessage());
        verify(transactionRepository, never()).save(any(Transaction.class));
        verify(accountRepository, never()).save(any(Account.class));
    }
}
