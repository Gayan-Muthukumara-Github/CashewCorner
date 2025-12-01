package com.example.cashewcorner.exception;

/**
 * Exception thrown when authentication fails.
 * Used for invalid credentials or authentication errors.
 */
public class AuthenticationException extends RuntimeException {

    public AuthenticationException(String message) {
        super(message);
    }

    public AuthenticationException(String message, Throwable cause) {
        super(message, cause);
    }
}

