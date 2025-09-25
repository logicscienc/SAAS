# SaaS Notes Application (Backend)

This is the **backend** for a multi-tenant SaaS Notes Application, built with **Node.js**, **Express**, and **MongoDB**, deployed on **Vercel**.  

> **Note:** The backend code is located in the `server` folder of the project.

This backend supports:
- **Multi-tenancy** with strict tenant data isolation
- **JWT authentication**
- **Role-based access control** (Admin & Member)
- **Free vs Pro subscription plans** with feature gating
- **CRUD operations** for notes
- **Health check endpoint** for automated testing

The frontend is deployed separately and linked below.
https://github.com/logicscienc/saasFrontend
---

## **Live URLs**

| Service                  | URL |
|--------------------------|-----|
| **Backend Base URL**     | [https://saas-git-main-anju-kumaris-projects-d57c2c52.vercel.app/api/v1](https://saas-git-main-anju-kumaris-projects-d57c2c52.vercel.app/api/v1) |
| **Health Endpoint**      | [https://saas-git-main-anju-kumaris-projects-d57c2c52.vercel.app/api/v1/health](https://saas-git-main-anju-kumaris-projects-d57c2c52.vercel.app/api/v1/health) |
| **Frontend (Live App)**  | [https://saas-frontend-git-main-anju-kumaris-projects-d57c2c52.vercel.app](https://saas-frontend-git-main-anju-kumaris-projects-d57c2c52.vercel.app) |

> ⚠️ Navigating to `/api/v1` directly in a browser will show `"Cannot GET /api/v1"`.  
> This is expected because no default GET route is defined at that path.  
> Please use the endpoints listed below for testing.

---

## **Project Objective**

Build a multi-tenant SaaS Notes Application where:
- Multiple tenants (companies) can securely manage users and notes.
- Tenant isolation is strictly enforced.
- Roles:
  - **Admin:** Invite users, upgrade subscription plan.
  - **Member:** Create, view, edit, delete notes only.
- Free plan tenants are limited to 3 notes; Pro plan tenants have unlimited notes.
- Admin can upgrade their tenant via the upgrade endpoint.

---

## **Multi-Tenancy Approach**

**Shared Schema with Tenant ID**:
- Each `User` and `Note` document includes a `tenantId`.
- All queries filter by `tenantId` to enforce isolation.

Example:
```json
{
  "title": "First Note",
  "content": "Sample note content",
  "tenantId": "acme123",
  "createdBy": "user123"
}
## **Pre-Seeded Test Accounts**

| Tenant  | Email             | Password  | Role   |
|---------|-------------------|-----------|--------|
| Acme    | admin@acme.test   | password  | Admin  |
| Acme    | user@acme.test    | password  | Member |
| Globex  | admin@globex.test | password  | Admin  |
| Globex  | user@globex.test  | password  | Member |

> All accounts are pre-seeded; no registration endpoint is required.

## **API Endpoints**

| Method | Endpoint                  | Description                        | Access |
|--------|---------------------------|------------------------------------|--------|
| GET    | `/health`                 | Health check                       | Public |
| POST   | `/auth/login`             | Login with email & password        | Public |
| POST   | `/notes`                  | Create a note                      | Member/Admin |
| GET    | `/notes`                  | List all notes for current tenant  | Member/Admin |
| GET    | `/notes/:id`              | Retrieve a specific note           | Member/Admin |
| PUT    | `/notes/:id`              | Update a note                      | Member/Admin |
| DELETE | `/notes/:id`              | Delete a note                      | Member/Admin |
| POST   | `/tenants/:slug/upgrade`  | Upgrade tenant to Pro plan         | Admin only |

## **Subscription Plans**

| Plan  | Max Notes | Upgrade Method |
|-------|-----------|----------------|
| Free  | 3 notes   | POST `/tenants/:slug/upgrade` |
| Pro   | Unlimited | N/A |

