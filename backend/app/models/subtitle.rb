class Subtitle < ApplicationRecord
	belongs_to :episode, foreign_key: "episode_id", primary_key: 'episode_id'
	belongs_to :movie, foreign_key: "movie_id", primary_key: 'movie_id'
end
