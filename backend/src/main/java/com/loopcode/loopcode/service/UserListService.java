package com.loopcode.loopcode.service;

import com.loopcode.loopcode.domain.user.UserList;
import com.loopcode.loopcode.dtos.UserListDto;
import com.loopcode.loopcode.repositories.UserListRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
public class UserListService {
    private final UserListRepository repo;

    public UserListService(UserListRepository repo) {
        this.repo = repo;
    }

    @Transactional(readOnly = true)
    public List<UserListDto> getListsFor(String username) {
        return repo.findByOwnerUsername(username).stream().map(list -> new UserListDto(
                list.getId(),
                list.getName(),
                list.getOwner().getUsername(),
                list.getExercises().stream()
                        .map(ex -> ex.getId())
                        .collect(Collectors.toSet())))
                .toList();
    }
}
