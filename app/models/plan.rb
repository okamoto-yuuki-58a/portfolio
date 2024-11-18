class Plan < ApplicationRecord
  belongs_to :user

  validates :name, presence: true
  validates :prefecture, presence: true
  validates :start_date, presence: true
  validates :end_date, presence: true
  validate :end_date_after_start_date

  private

  def end_date_after_start_date
    return if end_date.blank? || start_date.blank?

    if end_date < start_date
      errors.add(:end_date, "は開始日より後の日付を選択してください")
    end
  end
end