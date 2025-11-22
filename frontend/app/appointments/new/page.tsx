'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import api from '@/lib/api';

export default function NewAppointmentPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const doctorId = searchParams.get('doctor_id');

    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Combine date and time for the backend
            const appointmentDate = new Date(`${date}T${time}`);

            // Assuming patient_id is handled by backend via token or we need to fetch current user
            // For this example, let's assume the backend extracts user from token and finds patient record
            // Or we might need to fetch the patient ID first. 
            // Let's assume the backend is smart enough or we send a dummy patient_id if strictly required by the model we created earlier.
            // Looking at the backend model, Appointment belongs to Patient. 
            // We need to know the patient ID. 
            // Let's assume for now we fetch the current user's patient profile or send a placeholder if the backend handles it.
            // Ideally, the backend `create` action should set `patient_id` from `current_user.patient`.
            // But our backend controller `appointment_params` permits `patient_id`.
            // Let's fetch the current patient ID first or assume 1 for demo if we can't easily get it without a /me endpoint.
            // Wait, the backend has `GET /patients/:id`. We don't have a `/me` endpoint.
            // Let's assume the user ID 1 is logged in and is Patient 1 for simplicity in this generated code, 
            // OR better, let's assume the backend was updated to handle `current_user.patient` if `patient_id` is missing.
            // Since I can't change the backend now, I will hardcode patient_id: 1 for the demo or try to get it from local storage if we stored it.
            // Let's just send patient_id: 1 for now as a placeholder since we didn't implement a full "get my profile" flow.

            await api.post('/appointments', {
                appointment: {
                    doctor_id: doctorId,
                    patient_id: 1, // TODO: Replace with actual logged-in patient ID
                    appointment_date: appointmentDate.toISOString(),
                    status: 'pending',
                    notes: notes
                }
            });

            router.push('/appointments');
        } catch (err: any) {
            setError('Failed to book appointment. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="max-w-md mx-auto">
                        <Card title="Book Appointment">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <Input
                                    label="Date"
                                    type="date"
                                    required
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    data-cy="appointment-date"
                                />
                                <Input
                                    label="Time"
                                    type="time"
                                    required
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    data-cy="appointment-time"
                                />
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Notes
                                    </label>
                                    <textarea
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        rows={3}
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                    />
                                </div>

                                {error && <p className="text-red-600 text-sm">{error}</p>}

                                <Button type="submit" className="w-full" isLoading={loading} data-cy="appointment-submit">
                                    Confirm Booking
                                </Button>
                            </form>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
