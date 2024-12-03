class Plan < ApplicationRecord
  belongs_to :user
  has_many :spot_lists, -> { order(position: :asc) }, dependent: :destroy

  validates :name, presence: true
  validates :prefecture, presence: true
  validates :start_date, presence: true
  validates :end_date, presence: true
  validate :end_date_after_start_date

  accepts_nested_attributes_for :spot_lists, allow_destroy: true, reject_if: :all_blank

  def self.ransackable_attributes(auth_object = nil)
    ["name", "prefecture", "start_date", "end_date"]
  end

  def self.ransackable_associations(auth_object = nil)
    ["user"]
  end

  private

  def end_date_after_start_date
    return if end_date.blank? || start_date.blank?

    if end_date < start_date
      errors.add(:end_date, "は開始日より後の日付を選択してください")
    end
  end
end