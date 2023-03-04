class CastOrCrew < ApplicationRecord
	belongs_to :person, foreign_key: "person_id", primary_key: 'person_id'
end
