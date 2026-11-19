package com.assignment.leavemanagement.controller;

import com.assignment.leavemanagement.dto.LeaveRequestDto;
import com.assignment.leavemanagement.dto.LeaveResponseDto;
import com.assignment.leavemanagement.service.LeaveService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/leaves")
public class LeaveController {

    private final LeaveService leaveService;

    public LeaveController(LeaveService leaveService) {
        this.leaveService = leaveService;
    }

    @GetMapping
    public ResponseEntity<List<LeaveResponseDto>> getAllLeaves() {
        return ResponseEntity.ok(leaveService.getAllLeaves());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LeaveResponseDto> getLeaveById(@PathVariable Long id) {
        return ResponseEntity.ok(leaveService.getLeaveById(id));
    }

    @PostMapping
    public ResponseEntity<LeaveResponseDto> createLeave(@Valid @RequestBody LeaveRequestDto requestDto) {
        LeaveResponseDto created = leaveService.createLeave(requestDto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LeaveResponseDto> updateLeave(@PathVariable Long id, @Valid @RequestBody LeaveRequestDto requestDto) {
        return ResponseEntity.ok(leaveService.updateLeave(id, requestDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLeave(@PathVariable Long id) {
        leaveService.deleteLeave(id);
        return ResponseEntity.noContent().build();
    }
}
