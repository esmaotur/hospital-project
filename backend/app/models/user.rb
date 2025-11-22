class User < ApplicationRecord
  has_secure_password

  has_one :doctor, dependent: :destroy
  has_one :patient, dependent: :destroy

  validates :email, presence: true, uniqueness: true
  validates :password, presence: true, length: { minimum: 6 }, if: -> { new_record? || !password.nil? }
end
