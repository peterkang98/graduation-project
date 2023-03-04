class ContinueWatching < ApplicationRecord
	belongs_to :movie, foreign_key: "movie_id", primary_key: 'movie_id', optional: true
	belongs_to :episode, foreign_key: "episode_id", primary_key: 'episode_id', optional: true
	belongs_to :user, foreign_key: "user_id", primary_key: 'id'
end
