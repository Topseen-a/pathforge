package com.pathforge.messaging.repository;

import com.pathforge.messaging.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface MessageRepository extends JpaRepository<Message, UUID> {

    List<Message> findByProject_IdOrderByCreatedAtAsc(UUID projectId);

    @Query("""
            SELECT m FROM Message m
            WHERE (m.sender.id = :userIdA AND m.receiver.id = :userIdB)
               OR (m.sender.id = :userIdB AND m.receiver.id = :userIdA)
            ORDER BY m.createdAt ASC
            """)
    List<Message> findConversation(@Param("userIdA") UUID userIdA, @Param("userIdB") UUID userIdB);
}