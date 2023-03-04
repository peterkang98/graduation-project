class Movie < ApplicationRecord
	self.primary_key = "movie_id"
	belongs_to :content, foreign_key: "movie_id"
	has_many :subtitles, foreign_key: "movie_id", primary_key: "movie_id"
	has_many :timestamps, foreign_key: "movie_id", primary_key: "movie_id"
	has_many :continue_watchings, foreign_key: "movie_id", primary_key: "movie_id"
end
