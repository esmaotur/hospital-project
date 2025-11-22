class Appointment < ApplicationRecord
  belongs_to :doctor
  belongs_to :patient

  validates :appointment_date, presence: true
  validates :status, presence: true, inclusion: { in: %w[pending confirmed cancelled completed] }
end
