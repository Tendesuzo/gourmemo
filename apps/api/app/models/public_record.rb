class PublicRecord < ApplicationRecord
  self.abstract_class = true
  connects_to database: {writing: :public}
end
