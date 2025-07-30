package com.loopcode.loopcode.domain.challenge; // adjust package as needed

import jakarta.persistence.Embeddable;
import lombok.Data;
import java.io.Serializable;
import java.time.LocalDate;

@Embeddable
@Data
public class ResolutionKey implements Serializable {
    private String username;
    private LocalDate challengeDate;
}