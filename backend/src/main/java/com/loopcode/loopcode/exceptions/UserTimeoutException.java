package com.loopcode.loopcode.exceptions;

import java.time.LocalDateTime;

public class UserTimeoutException extends RuntimeException {
    private final String timeoutReason;
    private final LocalDateTime timeoutEndDate;

    public UserTimeoutException(String timeoutReason, LocalDateTime timeoutEndDate) {
        super(String.format("User is temporarily timed out until %s: %s", timeoutEndDate, timeoutReason));
        this.timeoutReason = timeoutReason;
        this.timeoutEndDate = timeoutEndDate;
    }

    public String getTimeoutReason() {
        return timeoutReason;
    }

    public LocalDateTime getTimeoutEndDate() {
        return timeoutEndDate;
    }
}
