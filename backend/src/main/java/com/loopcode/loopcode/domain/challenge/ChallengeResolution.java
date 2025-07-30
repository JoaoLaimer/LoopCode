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

    @EmbeddedId
    private ResolutionKey id;

    @MapsId("username")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "username", nullable = false)
    private User user;

    @MapsId("challengeDate")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "challenge_date", nullable = false)
    private DailyChallenge challenge;

    @Column(nullable = false)
    private LocalDateTime resolvedAt;
}
