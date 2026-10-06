package com.banking.system.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.math.BigDecimal;

/**
 * Data Transfer Object for creating an account.
 */
@Data
public class AccountCreateRequest {

    @NotBlank(message = "Customer name is required")
    private String customerName;
    
    private BigDecimal initialBalance = BigDecimal.ZERO;
}
