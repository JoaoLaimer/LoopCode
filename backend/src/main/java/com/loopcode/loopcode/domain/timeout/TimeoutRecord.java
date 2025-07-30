package com.loopcode.loopcode.domain.timeout;

import com.loopcode.loopcode.domain.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "timeout_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TimeoutRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "timed_out_user_username", nullable = false)
    private User timedOutUser;

    @ManyToOne
    @JoinColumn(name = "admin_username", nullable = false)
    private User adminUser;

    @Column(nullable = false, length = 500)
    private String reason;

    @Column(nullable = false)
    private LocalDateTime timeoutDate;

    @Column(nullable = false)
    private int durationMinutes;

    @Transient
    private LocalDateTime timeoutEndDate;

    public LocalDateTime getTimeoutEndDate() {
        if (this.timeoutDate != null && this.durationMinutes > 0) {
            return this.timeoutDate.plusMinutes(this.durationMinutes);
        }
        return null;
    }

    @Column(nullable = false)
    private boolean active = true;
}