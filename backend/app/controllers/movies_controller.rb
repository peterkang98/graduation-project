class MoviesController < ApplicationController
	before_action :set_movie, only: %i[ show ]

	def show
    	render json: @result
  	end
  	
  	private
    # Use callbacks to share common setup or constraints between actions.
    	def set_movie
      		movie = Movie.find(params[:id])
      		content = movie.content
      		subtitles = movie.subtitles
      		timestamps = movie.timestamps.order("start_time ASC")
      		rating = UserRating.where("content_id = ? AND user_id = ?", params[:id], current_user.id).first
      		continue = ContinueWatching.where("user_id=? AND movie_id=?", current_user.id, movie.movie_id).first
      		@result = movie.as_json.merge!(content.as_json).merge!({:subtitles => subtitles, :timestamps => timestamps, :continue => continue, :rating => rating, :content => content}.as_json)
    	end
end