package com.pathforge.common;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;

import java.util.Objects;
import java.util.UUID;

/**
 * Base class for every entity backed by a UUID primary key.
 * <p>
 * Timestamp columns are deliberately NOT included here: the schema is not
 * uniform (e.g. {@code experience_records} has no created_at, {@code submissions}
 * uses submitted_at instead, several tables have created_at but no updated_at),
 * so each entity declares only the timestamp fields its own table actually has.
 */
@MappedSuperclass
public abstract class BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    public UUID getId() {
        return id;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof BaseEntity other)) return false;
        return id != null && id.equals(other.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}