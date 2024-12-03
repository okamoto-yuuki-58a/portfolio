class SpotList < ApplicationRecord
  belongs_to :plan
  acts_as_list scope: :plan

  validates :name, presence: true
  validates :latitude, presence: true
  validates :longitude, presence: true
end