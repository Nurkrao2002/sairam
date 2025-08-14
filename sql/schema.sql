-- Base tables for PinnSight

-- Tenants Table: Represents the companies using the platform
CREATE TABLE tenants (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    plan VARCHAR(50),
    users INT,
    last_active VARCHAR(255),
    status VARCHAR(50)
);

-- Users Table: Stores user information
CREATE TABLE users (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(255),
    avatar VARCHAR(255),
    tenant_id VARCHAR(20) REFERENCES tenants(id)
);

-- Roles Table: Defines the roles available in the system
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

-- Permissions Table: Defines the permissions for actions
CREATE TABLE permissions (
    id SERIAL PRIMARY KEY,
    description VARCHAR(255) UNIQUE NOT NULL
);

-- Role_Permissions Table: Maps roles to permissions
CREATE TABLE role_permissions (
    role_id INT REFERENCES roles(id),
    permission_id INT REFERENCES permissions(id),
    PRIMARY KEY (role_id, permission_id)
);

-- Support Tickets Table: Stores support ticket information
CREATE TABLE support_tickets (
    id VARCHAR(20) PRIMARY KEY,
    subject VARCHAR(255) NOT NULL,
    tenant_id VARCHAR(20) REFERENCES tenants(id),
    user_email VARCHAR(255),
    priority VARCHAR(50),
    status VARCHAR(50),
    created_at TIMESTAMP,
    last_updated_at TIMESTAMP
);

-- Reports Table: Stores information about available reports
CREATE TABLE reports (
    id VARCHAR(20) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    last_generated_at TIMESTAMP
);
