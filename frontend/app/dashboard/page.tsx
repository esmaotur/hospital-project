'use client';

import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <Card title="Find a Doctor">
                            <p className="text-gray-600 mb-4">Browse our list of specialists and book an appointment.</p>
                            <Link href="/doctors">
                                <Button className="w-full" data-cy="view-doctors-button">View Doctors</Button>
                            </Link>
                        </Card>
                        <Card title="My Appointments">
                            <p className="text-gray-600 mb-4">View and manage your upcoming appointments.</p>
                            <Link href="/appointments">
                                <Button variant="secondary" className="w-full" data-cy="view-appointments-button">View Appointments</Button>
                            </Link>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
