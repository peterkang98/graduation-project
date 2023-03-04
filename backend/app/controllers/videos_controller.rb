class VideosController < ApplicationController
	before_action :authenticate_user!
	def stream
		path = Rails.root.join('videos') + [params[:filepath], params[:format]].join('.')
		
		if File.exists?(path) && (current_user.membership_time_left > 0)
			if(request.headers["HTTP_RANGE"]) && Rails.env.development?
				size = File.size(path)
			    bytes = Rack::Utils.byte_ranges(request.headers, size)[0]
			    offset = bytes.begin
			    length = bytes.end - bytes.begin + 1

			    response.header["Accept-Ranges"]=  "bytes"
			    response.header["Content-Range"] = "bytes #{bytes.begin}-#{bytes.end}/#{size}"
			    response.header["Content-Length"] = "#{length}"

			    send_data IO.binread(path, length, offset), :type => "video/mp4", :stream => true,
			    :disposition => 'inline', status: "206"
			    
  			elsif params[:format] == "mpd"
    			send_file(path, x_sendfile:true)
  			end
		else
			raise ActionController::RoutingError, "resource not found or you're not authorized"
		end
	end
end