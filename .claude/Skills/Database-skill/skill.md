---
name: database-skill
description: Design and manage PostgreSQL databases with schema design, table creation, migrations, relationships, indexing, and Neon Serverless best practices. Use whenever creating or modifying a database.
---

# Database Skill

## Objective

Design scalable, maintainable, and production-ready PostgreSQL databases with clean schema design, safe migrations, and optimized performance.

This skill applies to:

- Database Schema Design
- Table Creation
- Migrations
- Relationships
- Constraints
- Indexing
- Query Optimization
- Neon Serverless PostgreSQL

---

# Schema Design

Design schemas that are:

- Normalized
- Scalable
- Maintainable
- Easy to extend
- Production-ready

Follow these principles:

- Use meaningful table names.
- Use singular or plural naming consistently.
- Use UUIDs or serial IDs consistently.
- Separate entities into logical tables.
- Avoid duplicated data.
- Design for future growth.

Checklist:

- Normalize data appropriately.
- Define clear relationships.
- Choose appropriate data types.
- Use timestamps where applicable.
- Keep naming consistent.

---

# Table Creation

Every table should include:

- Primary Key
- Required columns
- Proper data types
- Constraints
- Default values
- Created timestamp
- Updated timestamp

Example checklist:

- Primary key defined.
- NOT NULL where appropriate.
- DEFAULT values configured.
- Unique constraints applied.
- Foreign keys configured.
- Timestamp columns included.

---

# Relationships

Design relationships using:

- One-to-One
- One-to-Many
- Many-to-Many

Always:

- Use foreign keys.
- Maintain referential integrity.
- Define cascade behavior intentionally.
- Avoid orphaned records.

Examples:

- User → Posts
- User → Orders
- Product → Category
- Order → Order Items

---

# Constraints

Apply database constraints whenever possible.

Use:

- PRIMARY KEY
- FOREIGN KEY
- UNIQUE
- NOT NULL
- CHECK
- DEFAULT

Never rely solely on application validation.

---

# Migrations

Every schema change must have a migration.

Migration rules:

- Keep migrations small.
- Make migrations deterministic.
- Preserve existing data.
- Make migrations reversible whenever possible.
- Separate schema changes from seed data.
- Never edit previously executed migrations.

Migration Checklist:

- New tables created.
- Columns added safely.
- Indexes included.
- Constraints added.
- Rollback supported.
- Migration tested.

---

# Indexing

Create indexes for:

- Foreign keys
- Frequently searched columns
- Sorting columns
- Filtering columns
- Unique values

Avoid:

- Over-indexing
- Duplicate indexes
- Unused indexes

Optimize for:

- Fast SELECT queries
- Efficient JOINs
- Pagination

---

# Query Design

Write SQL that is:

- Readable
- Efficient
- Parameterized
- Maintainable

Always:

- Select only required columns.
- Use WHERE clauses effectively.
- Use JOINs appropriately.
- Avoid unnecessary subqueries.
- Prevent N+1 query problems.

Never:

- Use SELECT *
- Build SQL through string concatenation.
- Execute unsafe queries.

---

# Transactions

Use transactions whenever operations must succeed together.

Examples:

- Order creation
- Payment processing
- User registration
- Inventory updates

Ensure:

- Atomicity
- Consistency
- Isolation
- Durability (ACID)

---

# Data Integrity

Protect data using:

- Foreign keys
- Constraints
- Transactions
- Validation
- Consistent relationships

Prevent:

- Duplicate records
- Invalid references
- Partial writes
- Corrupted data

---

# Performance Best Practices

Optimize for:

- Fast reads
- Efficient writes
- Proper indexing
- Query execution plans
- Minimal locking
- Efficient pagination
- Connection pooling

Avoid:

- Full table scans
- Unnecessary joins
- Repeated queries
- Long-running transactions

---

# Neon Serverless Best Practices

When using Neon Serverless PostgreSQL:

- Use connection pooling.
- Keep transactions short.
- Optimize queries.
- Design for serverless scaling.
- Minimize unnecessary connections.
- Store credentials in environment variables.
- Use SSL connections.
- Keep migrations lightweight.

---

# Security

Always:

- Use parameterized queries.
- Prevent SQL injection.
- Store secrets in environment variables.
- Limit database permissions.
- Validate application input.
- Encrypt sensitive data where required.

Never:

- Hardcode database credentials.
- Execute raw user input.
- Expose database errors to users.
- Grant unnecessary privileges.

---

# Naming Conventions

Use consistent naming:

Tables:

- users
- posts
- orders
- products

Columns:

- id
- user_id
- created_at
- updated_at
- deleted_at

Indexes:

- idx_users_email
- idx_orders_user_id

Foreign Keys:

- fk_orders_user

---

# Code Quality

Database code should be:

- Modular
- Readable
- Documented
- Version controlled
- Maintainable

Separate:

- Schema
- Migrations
- Seeds
- Queries
- Models
- Repositories

---

# Testing Checklist

Verify:

- Tables created correctly.
- Migrations execute successfully.
- Rollbacks work.
- Relationships function correctly.
- Constraints prevent invalid data.
- Indexes improve performance.
- Queries return expected results.
- Transactions behave correctly.
- Foreign keys enforce integrity.

---

# Deliverables

Every database implementation should include:

- Well-designed schema
- Proper table definitions
- Safe migrations
- Primary and foreign keys
- Constraints
- Indexes
- Optimized queries
- Transaction support
- Security best practices
- Neon Serverless compatibility
- Clean, maintainable database architecture