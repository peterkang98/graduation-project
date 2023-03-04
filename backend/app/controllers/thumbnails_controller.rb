class ThumbnailsController < ApplicationController
	def makethumbnail
		path = (Rails.root + params[:filepath]).to_s + "_720.mp4"
		img_path = path[0..-9] + ".jpg"
		puts(path)
		if File.exists?(path)
			if !File.exists?(img_path)
				movie = FFMPEG::Movie.new(path)
				movie.screenshot(img_path, seek_time: 60)
			end
			send_file(img_path, x_sendfile:true, :type => 'image/jpeg', :disposition => 'inline')
		else
			raise ActionController::RoutingError, "resource not found"
		end
	end
end