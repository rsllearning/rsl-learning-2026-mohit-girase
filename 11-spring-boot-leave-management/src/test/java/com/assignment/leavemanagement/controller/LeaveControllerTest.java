package com.assignment.leavemanagement.controller;

import com.assignment.leavemanagement.dto.LeaveRequestDto;
import com.assignment.leavemanagement.dto.LeaveResponseDto;
import com.assignment.leavemanagement.exception.ResourceNotFoundException;
import com.assignment.leavemanagement.service.LeaveService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(LeaveController.class)
class LeaveControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private LeaveService leaveService;

    private LeaveResponseDto sampleResponseDto;
    private LeaveRequestDto sampleRequestDto;

    @BeforeEach
    void setUp() {
        sampleResponseDto = new LeaveResponseDto(
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
    void getAllLeaves_ShouldReturnStatus200() throws Exception {
        when(leaveService.getAllLeaves()).thenReturn(Collections.singletonList(sampleResponseDto));

        mockMvc.perform(get("/leaves"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].employeeId").value("EMP001"));
    }

    @Test
    void getLeaveById_WhenExists_ShouldReturnStatus200() throws Exception {
        when(leaveService.getLeaveById(1L)).thenReturn(sampleResponseDto);

        mockMvc.perform(get("/leaves/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.leaveType").value("ANNUAL"));
    }

    @Test
    void getLeaveById_WhenNotFound_ShouldReturnStatus404() throws Exception {
        when(leaveService.getLeaveById(99L)).thenThrow(new ResourceNotFoundException("Leave request not found with id: 99"));

        mockMvc.perform(get("/leaves/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("Leave request not found with id: 99"));
    }

    @Test
    void createLeave_WhenValid_ShouldReturnStatus201() throws Exception {
        when(leaveService.createLeave(any(LeaveRequestDto.class))).thenReturn(sampleResponseDto);

        mockMvc.perform(post("/leaves")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sampleRequestDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.status").value("PENDING"));
    }

    @Test
    void createLeave_WhenInvalid_ShouldReturnStatus400() throws Exception {
        LeaveRequestDto invalidDto = new LeaveRequestDto();

        mockMvc.perform(post("/leaves")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidDto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));
    }

    @Test
    void updateLeave_WhenValid_ShouldReturnStatus200() throws Exception {
        when(leaveService.updateLeave(eq(1L), any(LeaveRequestDto.class))).thenReturn(sampleResponseDto);

        mockMvc.perform(put("/leaves/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sampleRequestDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L));
    }

    @Test
    void updateLeave_WhenNotFound_ShouldReturnStatus404() throws Exception {
        when(leaveService.updateLeave(eq(99L), any(LeaveRequestDto.class)))
                .thenThrow(new ResourceNotFoundException("Leave request not found with id: 99"));

        mockMvc.perform(put("/leaves/99")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sampleRequestDto)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }

    @Test
    void deleteLeave_WhenExists_ShouldReturnStatus204() throws Exception {
        doNothing().when(leaveService).deleteLeave(1L);

        mockMvc.perform(delete("/leaves/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void deleteLeave_WhenNotFound_ShouldReturnStatus404() throws Exception {
        doThrow(new ResourceNotFoundException("Leave request not found with id: 99")).when(leaveService).deleteLeave(99L);

        mockMvc.perform(delete("/leaves/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }
}
