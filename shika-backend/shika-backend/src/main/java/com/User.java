package com.shikahotel.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "hotel_users")
public class User {

    @Id
    private String userId;
    private String password;
    private String role; // MANAGER or STAFF
    private String department; // Housekeeping, Chef, etc.

    public User() {}

    public User(String userId, String password, String role, String department) {
        this.userId = userId;
        this.password = password;
        this.role = role;
        this.department = department;
    }

    // Getters and Setters
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
}