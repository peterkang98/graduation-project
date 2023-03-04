class UserRating < ApplicationRecord
	belongs_to :content, foreign_key: "content_id"
	belongs_to :user, foreign_key: "user_id"
end