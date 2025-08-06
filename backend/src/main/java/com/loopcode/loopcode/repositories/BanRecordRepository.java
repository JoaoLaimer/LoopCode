package com.loopcode.loopcode.repositories;

import com.loopcode.loopcode.domain.ban.BanRecord;
import com.loopcode.loopcode.domain.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BanRecordRepository extends JpaRepository<BanRecord, Long> {
    Optional<BanRecord> findByBannedUserAndActiveTrue(User bannedUser);
    
    Page<BanRecord> findByActiveTrue(Pageable pageable);
    
    Page<BanRecord> findByActiveFalse(Pageable pageable);
    
    Page<BanRecord> findAllByOrderByBanDateDesc(Pageable pageable);
}