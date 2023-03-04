class PlaylistsController < ApplicationController
	before_action :set_playlist, only: %i[ show ]

	def index
    	@playlists = Playlist.all
    	render json: @playlists
  	end

	def show
    	render json: { :playlist => @playlist, :contents => @contents_categories }
  	end
  	
  	private
    # Use callbacks to share common setup or constraints between actions.
    	def set_playlist
      		@playlist = Playlist.find(params[:id])
      		contents = @playlist.contents
      		@contents_categories = []
      		contents.each do |content|
      			@contents_categories << content.as_json.merge!({:categories => content.categories}.as_json)
      		end
    	end
end