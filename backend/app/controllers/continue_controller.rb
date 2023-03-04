class ContinueController < ApplicationController
	before_action :authenticate_user!

	def save
		@time = 0
		@continue = nil

		if params[:time].to_i > 0
			@time = (params[:time].to_i / 60.0).round(3)
		end

  		if params.key?(:movie_id)
  			if ContinueWatching.where("user_id = ? AND movie_id = ?", current_user.id, params[:movie_id]).count == 0
  				ContinueWatching.create(user_id: current_user.id, movie_id: params[:movie_id], episode_id: nil, resume_time: @time, updated: Time.now)
  			else
  				@continue = ContinueWatching.where("user_id = ? AND movie_id = ?", current_user.id, params[:movie_id]).first
  				@continue.resume_time = @time
  				@continue.updated = Time.now
  				@continue.save
  			end			
  		else
  			if ContinueWatching.where("user_id = ? AND episode_id = ?", current_user.id, params[:ep_id]).count == 0
  				ContinueWatching.create(user_id: current_user.id, episode_id: params[:ep_id], movie_id: nil, resume_time: @time, updated: Time.now)
  			else
  				@continue = ContinueWatching.where("user_id = ? AND episode_id = ?", current_user.id, params[:ep_id]).first
  				@continue.resume_time = @time
  				@continue.updated = Time.now
  				@continue.save
  			end	
  		end
  		
    	render json: {:continue => @continue}, status: 200
  	end

  	def show
  		@continue_list = ContinueWatching.where('user_id = ?', current_user.id)
  		if @continue_list.blank?
  			render json:{}, status: 200
  			return
  		end

  		season_list = []

  		episode_list = @continue_list.to_a.delete_if {|hash| hash["episode_id"] == nil}
  		episode_list.each do|history|
  			season_list << history.as_json.merge!(history.episode.tv_show_season.as_json).merge!({:duration => history.episode.duration, :episode_number => history.episode.episode_number})
  		end

  		season_list.each do |history|
  			history["updated"] = DateTime.parse(history["updated"]).to_i
  		end

  		season = season_list.group_by{|season| season['season_id']}.values.map{|ep| ep.max_by(1){|x| x["updated"]}}.flatten

  		movie_list = @continue_list.to_a.delete_if {|hash| hash["movie_id"] == nil}
  		movie_list.each do |movie|
  			season<<movie.as_json.merge!(movie.movie.content.as_json)
  		end
  		render json: {:playlist => {:playlist_title => "이어보기"}, :contents => season}, status: 200
  	end
end