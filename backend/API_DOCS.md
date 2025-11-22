# Hospital API Documentation

## Authentication

### POST /login
**Request:**
```json
{
  "email": "doctor@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "exp": "11-23-2025 10:00",
  "username": "doctor@example.com"
}
```

---

## Doctors

### GET /doctors
**Response (200 OK):**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "name": "Dr. House",
    "specialization": "Diagnostician",
    "created_at": "2025-11-22T10:00:00.000Z",
    "updated_at": "2025-11-22T10:00:00.000Z"
  },
  {
    "id": 2,
    "user_id": 2,
    "name": "Dr. Wilson",
    "specialization": "Oncology",
    "created_at": "2025-11-22T10:00:00.000Z",
    "updated_at": "2025-11-22T10:00:00.000Z"
  }
]
```

### GET /doctors/available
**Response (200 OK):**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "name": "Dr. House",
    "specialization": "Diagnostician",
    "created_at": "2025-11-22T10:00:00.000Z",
    "updated_at": "2025-11-22T10:00:00.000Z"
  }
]
```

---

## Patients

### GET /patients/:id
**Response (200 OK):**
```json
{
  "id": 1,
  "user_id": 3,
  "name": "John Doe",
  "dob": "1980-01-01",
  "address": "123 Main St",
  "created_at": "2025-11-22T10:00:00.000Z",
  "updated_at": "2025-11-22T10:00:00.000Z"
}
```

### GET /patients/:id/appointments
**Response (200 OK):**
```json
[
  {
    "id": 1,
    "doctor_id": 1,
    "patient_id": 1,
    "appointment_date": "2025-11-23T14:00:00.000Z",
    "status": "confirmed",
    "notes": "Regular checkup",
    "created_at": "2025-11-22T10:00:00.000Z",
    "updated_at": "2025-11-22T10:00:00.000Z"
  }
]
```

---

## Appointments

### POST /appointments
**Request:**
```json
{
  "appointment": {
    "doctor_id": 1,
    "patient_id": 1,
    "appointment_date": "2025-11-23T14:00:00Z",
    "status": "pending",
    "notes": "Initial consultation"
  }
}
```

**Response (201 Created):**
```json
{
  "id": 2,
  "doctor_id": 1,
  "patient_id": 1,
  "appointment_date": "2025-11-23T14:00:00.000Z",
  "status": "pending",
  "notes": "Initial consultation",
  "created_at": "2025-11-22T10:05:00.000Z",
  "updated_at": "2025-11-22T10:05:00.000Z"
}
```
