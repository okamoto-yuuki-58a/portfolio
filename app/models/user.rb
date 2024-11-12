class User < ApplicationRecord
  authenticates_with_sorcery!

  attr_accessor :password, :password_confirmation, :terms_of_service, :privacy_policy

  validates :username, presence: true, length: { minimum: 2, maximum: 50 }
  validates :email, presence: true, uniqueness: true
  validates :password, length: { minimum: 6 }, if: -> { new_record? || changes[:crypted_password] }
  validates :password, confirmation: true, if: -> { new_record? || changes[:crypted_password] }
  validates :password_confirmation, presence: true, if: -> { new_record? || changes[:crypted_password] }
  validates :terms_of_service, acceptance: true
  validates :privacy_policy, acceptance: true
end
