package com.loopcode.loopcode.domain.challenge;

import jakarta.persistence.*;
import lombok.*;
import java.io.Serializable;
import java.time.LocalDate;
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
    @ManyToOne
    @JoinColumn(name = "username")
    private com.loopcode.loopcode.domain.user.User user;

    @MapsId("challengeDate")
    @ManyToOne
    @JoinColumn(name = "challenge_date")
    private DailyChallenge challenge;

    @Column(nullable = false)
    private LocalDateTime resolvedAt;
}

@Embeddable
@Data
public class ResolutionKey implements Serializable {
    private String username;
    private LocalDate challengeDate;
}
