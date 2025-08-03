package com.loopcode.loopcode.domain.challenge;

import com.loopcode.loopcode.domain.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "challenge_resolutions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChallengeResolution {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "username", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "daily_challenge_id", nullable = false)
    private DailyChallenge dailyChallenge;

    @Column(nullable = false)
    private LocalDateTime resolvedAt;

    public ChallengeResolution(User user, DailyChallenge dailyChallenge, LocalDateTime resolvedAt) {
        this.user = user;
        this.dailyChallenge = dailyChallenge;
        this.resolvedAt = resolvedAt;
    }
}
