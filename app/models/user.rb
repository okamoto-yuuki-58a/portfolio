class User < ApplicationRecord
  authenticates_with_sorcery!

  has_many :plans

  validates :username, presence: true, length: { minimum: 2, maximum: 50 }
  validates :email, presence: true, uniqueness: true
  validates :password, length: { minimum: 6 }, if: -> { new_record? || changes[:crypted_password] }
  validates :password, confirmation: true, if: -> { new_record? || changes[:crypted_password] }
  validates :password_confirmation, presence: true, if: -> { new_record? || changes[:crypted_password] }
  validates :terms_of_service, acceptance: { message: 'に同意してください' }
  validates :privacy_policy, acceptance: { message: 'に同意してください' }
end
