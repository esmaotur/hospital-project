// path: cypress/e2e/appointments.cy.ts

describe('Randevu Alma Senaryosu', () => {
    beforeEach(() => {
        // Clear timeline at start
        cy.task('clearTimeline');

        // Mock Login
        cy.intercept('POST', '**/login', {
            statusCode: 200,
            body: { token: 'fake-jwt-token', username: 'patient@example.com' }
        }).as('login');

        // Mock Doctors List
        cy.intercept('GET', '**/doctors', {
            statusCode: 200,
            body: [
                { id: 1, name: 'Dr. Ahmet Yılmaz', specialization: 'Kardiyoloji' },
                { id: 2, name: 'Dr. Ayşe Demir', specialization: 'Nöroloji' }
            ]
        }).as('getDoctors');

        // Mock Create Appointment
        cy.intercept('POST', '**/appointments', {
            statusCode: 201,
            body: { id: 123, status: 'pending' }
        }).as('createAppointment');

        // Mock Patient Appointments
        cy.intercept('GET', '**/patients/*/appointments', {
            statusCode: 200,
            body: [
                {
                    id: 123,
                    doctor_id: 1,
                    patient_id: 1,
                    appointment_date: '2025-12-01T14:30:00',
                    status: 'pending',
                    notes: 'Genel kontrol randevusu istiyorum.'
                }
            ]
        }).as('getAppointments');
    });

    // Helper to log timeline
    const logStep = (message: string) => {
        cy.then(() => {
            const timestamp = Date.now();
            cy.task('logTimeline', { message, timestamp });
        });
    };

    it('Kullanıcı giriş yapar, doktor seçer ve randevu alır', () => {
        // 1. Site Açılıyor
        logStep("Kullanıcı giriş sayfasına yönlendiriliyor");
        cy.visit('/login');
        cy.wait(5000);

        // 2. Email
        logStep("Email yazılıyor");
        cy.get('[data-cy="email"]').type('patient@example.com');
        cy.wait(1500);

        // 3. Şifre
        logStep("Şifre yazılıyor");
        cy.get('[data-cy="password"]').type('password123');
        cy.wait(1500);

        // 4. Giriş
        logStep("Giriş yapılıyor");
        cy.get('[data-cy="login-button"]').click();
        cy.wait(3000);

        // 5. Dashboard
        cy.url().should('include', '/dashboard');
        logStep("Dashboard sayfası yüklendi");
        cy.wait(1500);

        // 6. Doktor Listesi Butonu
        logStep("Doktorlar listeleniyor");
        cy.get('[data-cy="view-doctors-button"]').click();
        cy.wait(3000);

        // 7. Doktor Sayfası
        cy.url().should('include', '/doctors');
        logStep("Doktor listesi sayfası yüklendi");
        cy.wait(1500);

        // 8. Doktor Seçimi
        logStep("İlk doktor seçildi ve randevu sayfasına gidiliyor");
        cy.get('[data-cy="doctor-card"]').first().within(() => {
            cy.contains('Book Appointment').click();
        });
        cy.wait(3000);

        // 9. Form Yüklendi
        cy.url().should('include', '/appointments/new');
        logStep("Randevu formu sayfası yüklendi");
        cy.wait(1000);

        // 10. Tarih
        logStep("Tarih seçiliyor");
        cy.get('[data-cy="appointment-date"]').type('2025-12-01');
        cy.wait(1500);

        // 11. Saat
        logStep("Saat seçiliyor");
        cy.get('[data-cy="appointment-time"]').type('14:30');
        cy.wait(1500);

        // 12. Not
        logStep("Not ekleniyor");
        cy.get('textarea').type('Genel kontrol randevusu istiyorum.');
        cy.wait(1500);

        // 13. Onay
        logStep("Randevu onaylanıyor");
        cy.get('[data-cy="appointment-submit"]').click();
        cy.wait(3000);

        // 14. Bitiş
        cy.url().should('include', '/appointments');
        logStep("Randevularım sayfası yüklendi - Test tamamlandı!");
        cy.wait(2000);
    });
});
