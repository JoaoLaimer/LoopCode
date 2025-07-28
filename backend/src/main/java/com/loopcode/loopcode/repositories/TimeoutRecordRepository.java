package com.loopcode.loopcode.repositories;

import com.loopcode.loopcode.domain.timeout.TimeoutRecord;
import com.loopcode.loopcode.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TimeoutRecordRepository extends JpaRepository<TimeoutRecord, Long> {
    Optional<TimeoutRecord> findByTimedOutUserAndActiveTrue(User timedOutUser);
}