class Doctor < ApplicationRecord
  belongs_to :user
  has_many :appointments, dependent: :destroy
  has_many :patients, through: :appointments

  validates :name, presence: true
  validates :specialization, presence: true
end
