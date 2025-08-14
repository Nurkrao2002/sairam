-- SQLINES DEMO *** le data for the PinnSight application

-- SQLINES DEMO *** for tenants table
INSERT INTO tenants (id, name, plan, users, last_active, status) VALUES
('ten_srisys', 'Srisys Inc.', 'Enterprise', 25, '2 hours ago', 'Active'),
('ten_pigeon', 'Pigeon-Tech', 'Enterprise', 6, '5 minutes ago', 'Active'),
('ten_2', 'Innovate Inc.', 'Paid', 10, '1 day ago', 'Active'),
('ten_3', 'Synergy Labs', 'Trial', 5, '3 days ago', 'Provisioning'),
('ten_4', 'QuantumLeap', 'Paid', 15, '5 hours ago', 'Active'),
('ten_5', 'DataWeavers', 'Free', 2, '1 week ago', 'Suspended');

-- SQLINES DEMO *** for users table
-- Note: Manually setting tenant_id based on email domain for mock data
INSERT INTO users (id, name, email, role, avatar, tenant_id) VALUES
('usr_1', 'Alice Johnson', 'admin@srisys.com', 'Company Admin', 'https://i.pravatar.cc/150?u=a042581f4e29026704d', 'ten_srisys'),
('usr_2', 'Robert Williams', 'finance@srisys.com', 'Finance Team', 'https://i.pravatar.cc/150?u=a042581f4e29026704e', 'ten_srisys'),
('usr_3', 'Charles Brown', 'sales@srisys.com', 'Sales & Marketing', 'https://i.pravatar.cc/150?u=a04258114e29026702d', 'ten_srisys'),
('usr_4', 'Diane Prince', 'ops@srisys.com', 'Operations Team', 'https://i.pravatar.cc/150?u=a048581f4e29026701d', 'ten_srisys'),
('usr_5', 'Edward Hunt', 'user@srisys.com', 'Basic User', 'https://i.pravatar.cc/150?u=a092581f4e29026703d', 'ten_srisys'),
('usr_6', 'Francis Castle', 'ceo@srisys.com', 'CEO/Executive', 'https://i.pravatar.cc/150?u=ceo-srisys', 'ten_srisys'),
('usr_11', 'Peter Quill', 'ceo@pigeon-tech.com', 'CEO/Executive', 'https://i.pravatar.cc/150?u=ceo-pigeon', 'ten_pigeon'),
('usr_12', 'Gamora Titan', 'admin@pigeon-tech.com', 'Company Admin', 'https://i.pravatar.cc/150?u=admin-pigeon', 'ten_pigeon'),
('usr_13', 'Drax Destroyer', 'ops@pigeon-tech.com', 'Operations Team', 'https://i.pravatar.cc/150?u=ops-pigeon', 'ten_pigeon'),
('usr_14', 'Rocket Raccoon', 'finance@pigeon-tech.com', 'Finance Team', 'https://i.pravatar.cc/150?u=finance-pigeon', 'ten_pigeon'),
('usr_15', 'Groot Flora', 'sales@pigeon-tech.com', 'Sales & Marketing', 'https://i.pravatar.cc/150?u=sales-pigeon', 'ten_pigeon'),
('usr_16', 'Mantis empath', 'user@pigeon-tech.com', 'Basic User', 'https://i.pravatar.cc/150?u=user-pigeon', 'ten_pigeon'),
('usr_7', 'Grace Lee', 'super@pinnsight.com', 'Platform Super Admin', 'https://i.pravatar.cc/150?u=super', NULL),
('usr_8', 'Helen Turner', 'manager@pinnsight.com', 'Platform Manager', 'https://i.pravatar.cc/150?u=manager', NULL);

-- SQLINES DEMO *** for roles table
INSERT INTO roles (name) VALUES
('Platform Super Admin'),
('Platform Manager'),
('Company Admin'),
('CEO/Executive'),
('Finance Team'),
('Sales & Marketing'),
('Operations Team'),
('Basic User');

-- SQLINES DEMO *** for permissions table
INSERT INTO permissions (description) VALUES
('Manages tenant accounts'),
('Manages platform settings'),
('Manages organization settings and users'),
('Access to all dashboards and reports'),
('Access to financial metrics'),
('Access to sales/marketing data'),
('Access to operational data'),
('Limited view-only access');

-- SQLINES DEMO *** for role_permissions table
-- Platform Super Admin
INSERT INTO role_permissions (role_id, permission_id) VALUES
((SELECT id FROM roles WHERE name = 'Platform Super Admin'), (SELECT id FROM permissions WHERE description = 'Manages tenant accounts')),
((SELECT id FROM roles WHERE name = 'Platform Super Admin'), (SELECT id FROM permissions WHERE description = 'Manages platform settings'));

-- Platform Manager
INSERT INTO role_permissions (role_id, permission_id) VALUES
((SELECT id FROM roles WHERE name = 'Platform Manager'), (SELECT id FROM permissions WHERE description = 'Manages tenant accounts'));

-- Company Admin
INSERT INTO role_permissions (role_id, permission_id) VALUES
((SELECT id FROM roles WHERE name = 'Company Admin'), (SELECT id FROM permissions WHERE description = 'Manages organization settings and users'));

-- CEO/Executive
INSERT INTO role_permissions (role_id, permission_id) VALUES
((SELECT id FROM roles WHERE name = 'CEO/Executive'), (SELECT id FROM permissions WHERE description = 'Access to all dashboards and reports'));

-- Finance Team
INSERT INTO role_permissions (role_id, permission_id) VALUES
((SELECT id FROM roles WHERE name = 'Finance Team'), (SELECT id FROM permissions WHERE description = 'Access to financial metrics'));

-- Sales & Marketing
INSERT INTO role_permissions (role_id, permission_id) VALUES
((SELECT id FROM roles WHERE name = 'Sales & Marketing'), (SELECT id FROM permissions WHERE description = 'Access to sales/marketing data'));

-- Operations Team
INSERT INTO role_permissions (role_id, permission_id) VALUES
((SELECT id FROM roles WHERE name = 'Operations Team'), (SELECT id FROM permissions WHERE description = 'Access to operational data'));

-- Basic User
INSERT INTO role_permissions (role_id, permission_id) VALUES
((SELECT id FROM roles WHERE name = 'Basic User'), (SELECT id FROM permissions WHERE description = 'Limited view-only access'));

-- SQLINES DEMO *** for support_tickets table
INSERT INTO support_tickets (id, subject, tenant_id, user_email, priority, status, created_at, last_updated_at) VALUES
('T-1234', 'Integration with Salesforce failing', 'ten_2', 'finance@innovate.com', 'High', 'Open', '2025-07-25 10:00:00', '2025-07-25 14:30:00'),
('T-1235', 'How to add a new user?', 'ten_4', 'admin@quantum.com', 'Low', 'Closed', '2025-07-24 11:00:00', '2025-07-24 11:30:00'),
('T-1236', 'API rate limit exceeded', 'ten_5', 'dev@dataweavers.com', 'Medium', 'In Progress', '2025-07-25 09:00:00', '2025-07-25 16:00:00'),
('T-1237', 'Cannot access reports', 'ten_srisys', 'ceo@srisys.com', 'High', 'Open', '2025-07-25 15:00:00', '2025-07-25 15:05:00'),
('T-1238', 'Feature request: Dark mode', 'ten_3', 'user@synergy.com', 'Low', 'Resolved', '2025-07-22 18:00:00', '2025-07-23 10:00:00'),
('T-1239', 'Billing question', 'ten_2', 'finance@innovate.com', 'Medium', 'Open', '2025-07-26 08:00:00', '2025-07-26 08:15:00');

-- SQLINES DEMO *** for reports table
INSERT INTO reports (id, title, description, category, last_generated_at) VALUES
('fin_01', 'Financial Summary', 'Revenue, Profit, EBITDA, and Margins.', 'financial', '2025-07-01 00:00:00'),
('fin_02', 'Cash Flow Statement', 'Detailed cash inflow and outflow.', 'financial', '2025-06-30 00:00:00'),
('fin_03', 'AR/AP Aging Report', 'Breakdown of outstanding receivables and payables.', 'financial', '2025-07-20 00:00:00'),
('fin_04', 'Profitability Analysis', 'Deep dive into profit margins and SGR.', 'financial', '2025-07-18 00:00:00'),
('mem_01', 'Customer Metrics', 'CLV, CAC, and Retention analysis.', 'membership', '2025-07-15 00:00:00'),
('mem_02', 'Churn Analysis', 'Analysis of lost members and reasons.', 'membership', '2025-07-10 00:00:00'),
('mem_03', 'NPS & CSAT Trends', 'Customer satisfaction trends over time.', 'membership', '2025-07-19 00:00:00'),
('sal_01', 'Lead Generation', 'Tracking of new leads by source.', 'sales', '2025-07-21 00:00:00'),
('sal_02', 'Sales Pipeline', 'Value and stage distribution of deals.', 'sales', '2025-07-22 00:00:00'),
('sal_03', 'Campaign ROI', 'Return on investment for marketing campaigns.', 'sales', '2025-07-23 00:00:00'),
('ops_01', 'Project Health', 'On-time completion and budget adherence.', 'operations', '2025-07-24 00:00:00'),
('ops_02', 'Resource Utilization', 'Team and employee billable hours.', 'operations', '2025-07-25 00:00:00'),
('ops_03', 'Service Delivery', 'SLA compliance and average delivery times.', 'operations', '2025-07-26 00:00:00');
