class SeasonsController < ApplicationController
	before_action :set_season, only: %i[ show ]

	def show
		if params[:snum].to_i == 0
			render json: @seasons
		else
			render json: { :season => @season, :episodes => @ep_list, :rating => @rating}
		end
    	
  	end
  	
  	private
    # Use callbacks to share common setup or constraints between actions.
    	def set_season
    		if params[:snum].to_i == 0
    			@seasons = TvShowSeason.where("content_id = ?", params[:id]).order("season_number ASC")
    		else
    			@season = TvShowSeason.where("content_id = ? AND season_number = ?", params[:id], params[:snum])
      			@episodes = @season.first.episodes.order("episode_number ASC")
      			@rating = UserRating.where("content_id = ? AND user_id = ?", params[:id], current_user.id).first
      			@ep_list = []
      			@episodes.each do |episode|
      				continue_watching = ContinueWatching.where("episode_id = ? AND user_id = ?", episode.episode_id, current_user.id).first
      				time = 0.0
      				if not continue_watching.blank?
      					time = continue_watching.resume_time.to_f
      				end
  					episode = episode.as_json.merge!({:resume_time => time})
  					@ep_list << episode
      			end
    		end
    	end
end