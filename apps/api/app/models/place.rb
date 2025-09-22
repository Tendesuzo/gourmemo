class Place < PrivateRecord
  has_many :visits, dependent: :destroy
  validates :name, presence: true
end
