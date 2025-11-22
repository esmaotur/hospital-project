📘 Hospital Management System

Rails + Next.js + Cypress + Video Pipeline

Bu proje; Yazılım Gerçekleme ve Test dersi kapsamında geliştirilmiş, tam entegre bir Hastane Yönetim Sistemidir.
Hem backend hem frontend hem de otomasyon testi & video üretim pipeline’ı içerir.

🚀 Teknolojiler

Backend: Ruby on Rails, PostgreSQL

Frontend: Next.js (React)

Test: Cypress

Seslendirme: ElevenLabs TTS

Video İşleme: FFmpeg

Pipeline: Tek komutla final-demo.mp4 üretimi

🏥 Özellikler

Kullanıcı girişi

Doktor listesi

Randevu oluşturma (tarih, saat, not)

Uygulama içi modern UI (lila/mor tema)

Cypress testlerinin video kaydı

Test adımlarından otomatik altyazı (srt) ve ses üretimi

Video + ses birleştirme (otomatik pipeline)

⚙️ Kurulum
Backend
cd backend
bundle install
rails db:create
rails db:migrate
rails s

Frontend
cd frontend
npm install
npm run dev

Ortam Değişkeni

.env.local içine:

ELEVENLABS_API_KEY=sk_xxxxxxxx

🎥 Pipeline Çalıştırma

Tüm test + ses + video üretimi:

./scripts/run_pipeline.sh


Çıktı:
final-demo.mp4

👩‍💻 Geliştirici

Esma Otur
