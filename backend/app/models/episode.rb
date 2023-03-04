class Episode < ApplicationRecord
	self.primary_key = "episode_id"
	belongs_to :tv_show_season, foreign_key: "season_id", primary_key: 'season_id'
	has_many :subtitles, foreign_key: "episode_id", primary_key: "episode_id"
	has_many :timestamps, foreign_key: "episode_id", primary_key: "episode_id"
	has_many :continue_watchings, foreign_key: "episode_id", primary_key: "episode_id"
end
