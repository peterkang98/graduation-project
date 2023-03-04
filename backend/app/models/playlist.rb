class Playlist < ApplicationRecord
	self.primary_key = "playlist_id"
	has_and_belongs_to_many :contents,
	-> { select('contents.content_id, contents.korean_title, contents.poster_path, contents.maturity_rating,
	contents.is_a_movie, contents.number_of_seasons, contents.duration_or_episodes') }, join_table: 'playlist_contents'
	has_one :home_card, primary_key: 'playlist_id', foreign_key: 'playlist_id'
end
