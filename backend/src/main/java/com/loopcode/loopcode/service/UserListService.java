package com.loopcode.loopcode.service;

import com.loopcode.loopcode.domain.user.User;
import com.loopcode.loopcode.domain.exercise.Exercise;
import com.loopcode.loopcode.domain.user.UserList;
import com.loopcode.loopcode.dtos.CreateUserListDto;
import com.loopcode.loopcode.dtos.UserListDto;
import com.loopcode.loopcode.exceptions.ResourceNotFoundException;
import com.loopcode.loopcode.repositories.ExerciseRepository;
import com.loopcode.loopcode.repositories.UserListRepository;
import com.loopcode.loopcode.repositories.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserListService {
    private final UserRepository userRepository;
    private final ExerciseRepository exerciseRepository;
    private final UserListRepository userListRepository;

    public UserListService(UserRepository userRepository,
            ExerciseRepository exerciseRepository,
            UserListRepository userListRepository) {
        this.userRepository = userRepository;
        this.exerciseRepository = exerciseRepository;
        this.userListRepository = userListRepository;
    }

    @Transactional(readOnly = true)
    public List<UserListDto> getListsFor(String username) {
        userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado: " + username));

        return userListRepository.findByOwnerUsername(username)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserListDto createList(String username, CreateUserListDto dto) {
        User owner = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado: " + username));

        UserList list = new UserList();
        list.setName(dto.name());
        list.setOwner(owner);

        dto.exerciseIds().forEach(id -> {
            Exercise ex = exerciseRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Exercício não encontrado: " + id));
            list.getExercises().add(ex);
        });

        UserList saved = userListRepository.save(list);
        return toDto(saved);
    }

    @Transactional(readOnly = true)
    public UserListDto getListById(String ownerUsername, Long listId) {
        UserList list = userListRepository.findByIdAndOwnerUsername(listId, ownerUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Lista não encontrada"));
        return new UserListDto(
                list.getId(),
                list.getName(),
                ownerUsername,
                list.getExercises().stream()
                        .map(Exercise::getId)
                        .collect(Collectors.toSet()));
    }

    @Transactional(readOnly = true)
    public java.util.List<UserListDto> getListsByUsername(String ownerUsername) {
        return userListRepository.findByOwnerUsername(ownerUsername).stream()
                .map(l -> new UserListDto(
                        l.getId(), l.getName(), ownerUsername,
                        l.getExercises().stream().map(Exercise::getId).collect(Collectors.toSet())))
                .collect(Collectors.toList());
    }

    private UserListDto toDto(UserList list) {
        return new UserListDto(
                list.getId(),
                list.getName(),
                list.getOwner().getUsername(),
                list.getExercises()
                        .stream()
                        .map(Exercise::getId)
                        .collect(Collectors.toSet()));
    }

}
