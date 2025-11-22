class Patient < ApplicationRecord
  belongs_to :user
  has_many :appointments, dependent: :destroy
  has_many :doctors, through: :appointments

  validates :name, presence: true
  validates :dob, presence: true
end
