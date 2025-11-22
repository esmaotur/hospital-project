export interface User {
    id: number;
    email: string;
}

export interface Doctor {
    id: number;
    name: string;
    specialization: string;
}

export interface Patient {
    id: number;
    name: string;
    dob: string;
    address: string;
}

export interface Appointment {
    id: number;
    doctor_id: number;
    patient_id: number;
    appointment_date: string;
    status: string;
    notes: string;
    doctor?: Doctor;
    patient?: Patient;
}
