class Content < ApplicationRecord
	self.primary_key = 'content_id'
	has_one :movie, primary_key: 'content_id', foreign_key: 'movie_id'
	has_one :home_card, primary_key: 'content_id', foreign_key: 'content_id'
	has_many :tv_show_seasons, primary_key: 'content_id', foreign_key: 'content_id'
	has_many :user_ratings, primary_key: 'content_id', foreign_key: 'content_id'
	has_and_belongs_to_many :playlists, join_table: 'playlist_contents'
	has_and_belongs_to_many :people, join_table: 'cast_or_crews'
	has_and_belongs_to_many :categories, join_table: 'content_categories'
end
