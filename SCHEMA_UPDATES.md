# Schema Updates and Integration Guide

## Summary of Changes

### 1. Employee Model - Added Missing Fields

**New Fields Added:**
- `phone` (STRING) - Employee phone number
- `personalEmail` (STRING) - Personal email address
- `dateOfBirth` (DATEONLY) - Date of birth
- `gender` (ENUM) - Male, Female, Other, Prefer not to say
- `location` (STRING) - Employee location
- `address` (TEXT) - Full address
- `employmentType` (ENUM) - Full-time, Part-time, Contract, Intern
- `shift` (STRING) - Shift timing
- `status` (ENUM) - Active, Inactive, On Leave, Terminated
- `managerId` (INTEGER) - Reference to manager employee
- `emergencyContactName` (STRING) - Emergency contact name
- `emergencyContactPhone` (STRING) - Emergency contact phone
- `emergencyContactRelation` (STRING) - Relation to employee
- `qualifications` (TEXT) - Educational qualifications
- `experience` (STRING) - Work experience
- `skills` (TEXT) - Skills and competencies
- `profileImage` (STRING) - Profile image URL/path

### 2. User Model - Added Username Field

**New Field:**
- `username` (STRING) - Optional username (defaults to email prefix if not set)

### 3. Employee Relationships

**New Relationship:**
- Self-referential relationship for Manager → Team Members
  - `Employee.belongsTo(Employee, { as: "manager" })`
  - `Employee.hasMany(Employee, { as: "teamMembers" })`

### 4. Updated Services

**Admin Service:**
- `createEmployeeService` - Now accepts all new fields
- `getEmployeesService` - Returns all fields including manager info
- `getEmployeeByIdService` - New service to get single employee
- `updateEmployeeService` - New service to update employee

**Auth Service:**
- Returns `username` field (generated from email if not set)
- Returns additional employee fields in response

### 5. Updated Controllers

**Admin Controller:**
- `createEmployeeController` - Handles all new fields
- `listEmployeesController` - Returns complete employee data
- `getEmployeeByIdController` - New endpoint to get employee by ID
- `updateEmployeeController` - New endpoint to update employee

**Auth Controller:**
- `meController` - Returns username and additional employee fields

### 6. Updated Routes

**Admin Routes:**
- `GET /api/admin/employees` - List all employees
- `POST /api/admin/employees` - Create employee
- `GET /api/admin/employees/:id` - Get employee by ID
- `PUT /api/admin/employees/:id` - Update employee

## Frontend Integration

### Employee List Component
Updated to display:
- Phone number
- Location
- Manager name
- Profile image

### Employee Profile Component
Now supports all fields:
- Personal information (phone, email, DOB, gender)
- Employment details (type, shift, status)
- Emergency contact
- Qualifications and skills
- Manager information

### API Response Structure

**Employee List Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "role": "EMPLOYEE",
  "employee": {
    "id": 1,
    "fullName": "John Doe",
    "employeeCode": "EMP001",
    "department": "IT",
    "designation": "Developer",
    "phone": "+91 98765 43210",
    "location": "Mumbai, India",
    "status": "Active",
    "manager": {
      "id": 2,
      "fullName": "Jane Manager",
      "employeeCode": "EMP002"
    }
  }
}
```

**User Response (from /api/auth/getUser):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "user",
  "role": "EMPLOYEE",
  "employee": {
    "id": 1,
    "fullName": "John Doe",
    "phone": "+91 98765 43210",
    "location": "Mumbai, India",
    "status": "Active",
    "profileImage": "/uploads/profile.jpg"
  }
}
```

## Database Migration Required

Since we added new fields to existing models, you'll need to run a migration:

```sql
-- Add new fields to employees table
ALTER TABLE employees 
ADD COLUMN phone VARCHAR(20),
ADD COLUMN personal_email VARCHAR(100),
ADD COLUMN date_of_birth DATE,
ADD COLUMN gender ENUM('Male', 'Female', 'Other', 'Prefer not to say'),
ADD COLUMN location VARCHAR(200),
ADD COLUMN address TEXT,
ADD COLUMN employment_type ENUM('Full-time', 'Part-time', 'Contract', 'Intern') DEFAULT 'Full-time',
ADD COLUMN shift VARCHAR(100),
ADD COLUMN status ENUM('Active', 'Inactive', 'On Leave', 'Terminated') DEFAULT 'Active',
ADD COLUMN manager_id INT,
ADD COLUMN emergency_contact_name VARCHAR(150),
ADD COLUMN emergency_contact_phone VARCHAR(20),
ADD COLUMN emergency_contact_relation VARCHAR(50),
ADD COLUMN qualifications TEXT,
ADD COLUMN experience VARCHAR(100),
ADD COLUMN skills TEXT,
ADD COLUMN profile_image VARCHAR(500),
ADD FOREIGN KEY (manager_id) REFERENCES employees(id);

-- Add username to users table
ALTER TABLE users 
ADD COLUMN username VARCHAR(100) UNIQUE;
```

## Backward Compatibility

All new fields are **optional** (allowNull: true), ensuring backward compatibility:
- Existing employees will work without new fields
- New fields can be added gradually
- Frontend handles missing fields gracefully

## Testing Checklist

- [ ] Create employee with all new fields
- [ ] Update employee with new fields
- [ ] List employees shows all fields
- [ ] Employee profile displays all information
- [ ] Manager relationship works correctly
- [ ] Username generation from email works
- [ ] Frontend handles missing optional fields


