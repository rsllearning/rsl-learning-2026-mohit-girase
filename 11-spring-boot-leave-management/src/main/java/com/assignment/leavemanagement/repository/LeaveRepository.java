package com.assignment.leavemanagement.repository;

import com.assignment.leavemanagement.model.Leave;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class LeaveRepository {

    private final Map<Long, Leave> store = new ConcurrentHashMap<>();
    private final AtomicLong idGenerator = new AtomicLong(1);

    public List<Leave> findAll() {
        return new ArrayList<>(store.values());
    }

    public Optional<Leave> findById(Long id) {
        return Optional.ofNullable(store.get(id));
    }

    public Leave save(Leave leave) {
        if (leave.getId() == null) {
            leave.setId(idGenerator.getAndIncrement());
        }
        store.put(leave.getId(), leave);
        return leave;
    }

    public boolean deleteById(Long id) {
        return store.remove(id) != null;
    }

    public boolean existsById(Long id) {
        return store.containsKey(id);
    }
}
