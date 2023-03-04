class EpisodesController < ApplicationController
	before_action :set_episode, only: %i[ show ]

	def show
    	render json: {:content => @content, :season => @season, :timestamps => @timestamps, :subtitles => @subtitles, :episode => @episode, :continue => @continue}
  	end
  	
  	private
    # Use callbacks to share common setup or constraints between actions.
    	def set_episode    		
      		@episode = Episode.find(params[:episode_id])
      		@continue = ContinueWatching.where("user_id=? AND episode_id=?", current_user.id, @episode.episode_id).first
      		@subtitles = @episode.subtitles
      		@timestamps = @episode.timestamps.order("start_time ASC")
      		@season = @episode.tv_show_season
      		@content = @season.content
    	end
end