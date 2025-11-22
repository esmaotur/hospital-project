'use client';

import { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/Card';
import api from '@/lib/api';
import { Appointment } from '@/types';

export default function AppointmentsPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                // Hardcoded patient ID 1 as per previous assumption
                const response = await api.get('/patients/1/appointments');
                setAppointments(response.data);
            } catch (error) {
                console.error('Failed to fetch appointments', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">My Appointments</h1>
                    {loading ? (
                        <p>Loading appointments...</p>
                    ) : appointments.length === 0 ? (
                        <p>No appointments found.</p>
                    ) : (
                        <div className="space-y-4">
                            {appointments.map((appointment) => (
                                <Card key={appointment.id}>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-medium text-lg">
                                                {new Date(appointment.appointment_date).toLocaleDateString()} at{' '}
                                                {new Date(appointment.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                            <p className="text-gray-600">Status: <span className="capitalize font-medium">{appointment.status}</span></p>
                                            {appointment.notes && <p className="text-gray-500 text-sm mt-1">{appointment.notes}</p>}
                                        </div>
                                        {/* We could fetch doctor details here if the API returned it included, or fetch separately */}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
