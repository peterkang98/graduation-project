class TvShowSeason < ApplicationRecord
	self.primary_key = 'season_id'
	belongs_to :content, foreign_key: "content_id"
	has_many :episodes, foreign_key: 'season_id', primary_key: 'season_id'
end
