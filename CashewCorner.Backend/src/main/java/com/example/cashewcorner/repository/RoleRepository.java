package com.example.cashewcorner.repository;

import com.example.cashewcorner.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for Role entity.
 * Provides database access methods for role operations.
 */
@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

    /**
     * Find a role by role name.
     *
     * @param roleName the role name to search for
     * @return Optional containing the role if found
     */
    Optional<Role> findByRoleName(String roleName);

    /**
     * Check if a role exists by role name.
     *
     * @param roleName the role name to check
     * @return true if role exists, false otherwise
     */
    boolean existsByRoleName(String roleName);
}
