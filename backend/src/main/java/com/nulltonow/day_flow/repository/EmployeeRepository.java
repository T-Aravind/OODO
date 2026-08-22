package com.nulltonow.day_flow.repository;

import com.nulltonow.day_flow.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, String> {

    Optional<Employee> findByEmailIgnoreCase(String email);

    Optional<Employee> findByLoginIdIgnoreCase(String loginId);

    Optional<Employee> findByEmailIgnoreCaseOrLoginIdIgnoreCase(String email, String loginId);

    boolean existsByEmailIgnoreCase(String email);

    boolean existsByLoginIdIgnoreCase(String loginId);
}
