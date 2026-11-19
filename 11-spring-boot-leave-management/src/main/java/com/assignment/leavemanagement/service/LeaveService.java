package com.assignment.leavemanagement.service;

import com.assignment.leavemanagement.dto.LeaveRequestDto;
import com.assignment.leavemanagement.dto.LeaveResponseDto;
import com.assignment.leavemanagement.exception.ResourceNotFoundException;
import com.assignment.leavemanagement.model.Leave;
import com.assignment.leavemanagement.repository.LeaveRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LeaveService {

    private final LeaveRepository leaveRepository;

    public LeaveService(LeaveRepository leaveRepository) {
        this.leaveRepository = leaveRepository;
    }

    public List<LeaveResponseDto> getAllLeaves() {
        return leaveRepository.findAll().stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    public LeaveResponseDto getLeaveById(Long id) {
        Leave leave = leaveRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found with id: " + id));
        return mapToResponseDto(leave);
    }

    public LeaveResponseDto createLeave(LeaveRequestDto requestDto) {
        Leave leave = new Leave();
        leave.setEmployeeId(requestDto.getEmployeeId());
        leave.setLeaveType(requestDto.getLeaveType());
        leave.setStartDate(requestDto.getStartDate());
        leave.setEndDate(requestDto.getEndDate());
        leave.setReason(requestDto.getReason());
        leave.setStatus(requestDto.getStatus() != null && !requestDto.getStatus().isBlank() 
                ? requestDto.getStatus() 
                : "PENDING");

        Leave savedLeave = leaveRepository.save(leave);
        return mapToResponseDto(savedLeave);
    }

    public LeaveResponseDto updateLeave(Long id, LeaveRequestDto requestDto) {
        Leave existingLeave = leaveRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found with id: " + id));

        existingLeave.setEmployeeId(requestDto.getEmployeeId());
        existingLeave.setLeaveType(requestDto.getLeaveType());
        existingLeave.setStartDate(requestDto.getStartDate());
        existingLeave.setEndDate(requestDto.getEndDate());
        existingLeave.setReason(requestDto.getReason());
        if (requestDto.getStatus() != null && !requestDto.getStatus().isBlank()) {
            existingLeave.setStatus(requestDto.getStatus());
        }

        Leave updatedLeave = leaveRepository.save(existingLeave);
        return mapToResponseDto(updatedLeave);
    }

    public void deleteLeave(Long id) {
        if (!leaveRepository.existsById(id)) {
            throw new ResourceNotFoundException("Leave request not found with id: " + id);
        }
        leaveRepository.deleteById(id);
    }

    private LeaveResponseDto mapToResponseDto(Leave leave) {
        return new LeaveResponseDto(
                leave.getId(),
                leave.getEmployeeId(),
                leave.getLeaveType(),
                leave.getStartDate(),
                leave.getEndDate(),
                leave.getReason(),
                leave.getStatus()
        );
    }
}
