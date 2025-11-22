// path: cypress/e2e/appointments.cy.ts

describe('Randevu Alma Senaryosu', () => {
    beforeEach(() => {
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

    it('Kullanıcı giriş yapar, doktor seçer ve randevu alır (40 saniye)', () => {
        // 0-3 sn: Site açılıyor
        cy.visit('/login');
        cy.log("0-3s: Kullanıcı giriş sayfasına yönlendiriliyor");
        cy.wait(3000);

        // 3-5 sn: Email
        cy.log("3-5s: Email yazılıyor");
        cy.get('[data-cy="email"]').type('patient@example.com');
        cy.wait(2000);

        // 5-8 sn: Şifre
        cy.log("5-8s: Şifre yazılıyor");
        cy.get('[data-cy="password"]').type('password123');
        cy.wait(3000);

        // 8-12 sn: Giriş
        cy.log("8-12s: Giriş yapılıyor");
        cy.get('[data-cy="login-button"]').click();
        cy.wait(4000);

        // 12-14 sn: Dashboard
        cy.url().should('include', '/dashboard');
        cy.log("12-14s: Dashboard sayfası yüklendi");
        cy.wait(2000);

        // 14-20 sn: Doktorlar
        cy.log("14-20s: Doktorlar listeleniyor");
        cy.get('[data-cy="view-doctors-button"]').click();
        cy.wait(6000);

        // 20-22 sn: Doktor Listesi
        cy.url().should('include', '/doctors');
        cy.log("20-22s: Doktor listesi sayfası yüklendi");
        cy.wait(2000);

        // 22-27 sn: Doktor Seçimi
        cy.log("22-27s: İlk doktor seçildi ve randevu sayfasına gidiliyor");
        cy.get('[data-cy="doctor-card"]').first().within(() => {
            cy.contains('Book Appointment').click();
        });
        cy.wait(5000);

        // 27-28 sn: Form Yüklendi
        cy.url().should('include', '/appointments/new');
        cy.log("27-28s: Randevu formu sayfası yüklendi");
        cy.wait(1000);

        // 28-30 sn: Tarih
        cy.log("28-30s: Tarih seçiliyor");
        cy.get('[data-cy="appointment-date"]').type('2025-12-01');
        cy.wait(2000);

        // 30-32 sn: Saat
        cy.log("30-32s: Saat seçiliyor");
        cy.get('[data-cy="appointment-time"]').type('14:30');
        cy.wait(2000);

        // 32-34 sn: Not
        cy.log("32-34s: Not ekleniyor");
        cy.get('textarea').type('Genel kontrol randevusu istiyorum.');
        cy.wait(2000);

        // 34-38 sn: Onay
        cy.log("34-38s: Randevu onaylanıyor");
        cy.get('[data-cy="appointment-submit"]').click();
        cy.wait(4000);

        // 38-40 sn: Bitiş
        cy.url().should('include', '/appointments');
        cy.log("38-40s: Randevularım sayfası yüklendi - Test tamamlandı!");
        cy.wait(2000);
    });
});
