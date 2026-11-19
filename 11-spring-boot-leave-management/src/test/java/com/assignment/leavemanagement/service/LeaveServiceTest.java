package com.assignment.leavemanagement.service;

import com.assignment.leavemanagement.dto.LeaveRequestDto;
import com.assignment.leavemanagement.dto.LeaveResponseDto;
import com.assignment.leavemanagement.exception.ResourceNotFoundException;
import com.assignment.leavemanagement.model.Leave;
import com.assignment.leavemanagement.repository.LeaveRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LeaveServiceTest {

    @Mock
    private LeaveRepository leaveRepository;

    @InjectMocks
    private LeaveService leaveService;

    private Leave sampleLeave;
    private LeaveRequestDto sampleRequestDto;

    @BeforeEach
    void setUp() {
        sampleLeave = new Leave(
                1L,
                "EMP001",
                "ANNUAL",
                LocalDate.of(2026, 12, 1),
                LocalDate.of(2026, 12, 5),
                "Annual vacation",
                "PENDING"
        );

        sampleRequestDto = new LeaveRequestDto(
                "EMP001",
                "ANNUAL",
                LocalDate.of(2026, 12, 1),
                LocalDate.of(2026, 12, 5),
                "Annual vacation"
        );
    }

    @Test
    void getAllLeaves_ShouldReturnAllLeaveDtos() {
        when(leaveRepository.findAll()).thenReturn(Arrays.asList(sampleLeave));

        List<LeaveResponseDto> result = leaveService.getAllLeaves();

        assertEquals(1, result.size());
        assertEquals("EMP001", result.get(0).getEmployeeId());
        assertEquals("ANNUAL", result.get(0).getLeaveType());
        verify(leaveRepository, times(1)).findAll();
    }

    @Test
    void getLeaveById_WhenFound_ShouldReturnDto() {
        when(leaveRepository.findById(1L)).thenReturn(Optional.of(sampleLeave));

        LeaveResponseDto result = leaveService.getLeaveById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("EMP001", result.getEmployeeId());
        verify(leaveRepository, times(1)).findById(1L);
    }

    @Test
    void getLeaveById_WhenNotFound_ShouldThrowException() {
        when(leaveRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> leaveService.getLeaveById(99L));
        verify(leaveRepository, times(1)).findById(99L);
    }

    @Test
    void createLeave_ShouldSaveAndReturnDto() {
        when(leaveRepository.save(any(Leave.class))).thenReturn(sampleLeave);

        LeaveResponseDto result = leaveService.createLeave(sampleRequestDto);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("PENDING", result.getStatus());
        verify(leaveRepository, times(1)).save(any(Leave.class));
    }

    @Test
    void updateLeave_WhenFound_ShouldUpdateAndReturnDto() {
        when(leaveRepository.findById(1L)).thenReturn(Optional.of(sampleLeave));
        when(leaveRepository.save(any(Leave.class))).thenReturn(sampleLeave);

        LeaveRequestDto updateDto = new LeaveRequestDto(
                "EMP001",
                "SICK",
                LocalDate.of(2026, 12, 2),
                LocalDate.of(2026, 12, 4),
                "Flu recovery",
                "APPROVED"
        );

        LeaveResponseDto result = leaveService.updateLeave(1L, updateDto);

        assertNotNull(result);
        verify(leaveRepository, times(1)).findById(1L);
        verify(leaveRepository, times(1)).save(any(Leave.class));
    }

    @Test
    void updateLeave_WhenNotFound_ShouldThrowException() {
        when(leaveRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> leaveService.updateLeave(99L, sampleRequestDto));
        verify(leaveRepository, times(1)).findById(99L);
        verify(leaveRepository, never()).save(any(Leave.class));
    }

    @Test
    void deleteLeave_WhenFound_ShouldDelete() {
        when(leaveRepository.existsById(1L)).thenReturn(true);
        doReturn(true).when(leaveRepository).deleteById(1L);

        assertDoesNotThrow(() -> leaveService.deleteLeave(1L));
        verify(leaveRepository, times(1)).existsById(1L);
        verify(leaveRepository, times(1)).deleteById(1L);
    }

    @Test
    void deleteLeave_WhenNotFound_ShouldThrowException() {
        when(leaveRepository.existsById(99L)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> leaveService.deleteLeave(99L));
        verify(leaveRepository, times(1)).existsById(99L);
        verify(leaveRepository, never()).deleteById(anyLong());
    }
}
