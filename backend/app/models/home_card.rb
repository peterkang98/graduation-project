class HomeCard < ApplicationRecord
	self.primary_key = "card_id"
	belongs_to :content, foreign_key: "content_id"
	belongs_to :playlist, foreign_key: "playlist_id"
end
