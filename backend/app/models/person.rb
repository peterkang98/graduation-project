class Person < ApplicationRecord
	self.primary_key = "person_id"
	has_and_belongs_to_many :contents, join_table: 'cast_or_crews'
	has_many :cast_or_crews, primary_key: 'person_id', foreign_key: 'person_id'
end
