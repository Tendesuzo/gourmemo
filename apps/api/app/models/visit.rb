class Visit < PrivateRecord
  belongs_to :place, class_name: "Place"
  belongs_to :user
  validates :rating, numericality: {greater_than_or_equal_to: 0, less_than_or_equal_to: 5}, allow_nil: true
end
