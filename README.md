# SaaS Notes Application

A multi-tenant SaaS Notes Application with strict data isolation using the shared schema with tenant ID approach.

## Multi-Tenant Architecture: Shared Schema with Tenant ID Approach

### Overview
This application uses a **shared schema with tenant ID** approach for multi-tenancy. All tenants share the same database and schema, but data isolation is enforced through a `tenantId` field in every document.

### How It Works

#### 1. Tenant ID Column
Every data model includes a `tenantId` field that references the tenant:

```typescript
// Example schema structure
{
  _id: ObjectId,
  tenantId: ObjectId, // Required field linking to tenant
  // ... other fields
}
```

#### 2. Strict Query Filtering
All database queries **must** include the `tenantId` filter to ensure data isolation:

```typescript
// ✅ Correct - Always filter by tenantId
User.find({ tenantId: currentTenantId, isActive: true })

// ❌ Incorrect - Missing tenantId filter
User.find({ isActive: true }) // This would expose data across tenants
```
