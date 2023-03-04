class Category < ApplicationRecord
	self.primary_key = 'category_id'
	has_and_belongs_to_many :contents, join_table: 'content_categories'
end
