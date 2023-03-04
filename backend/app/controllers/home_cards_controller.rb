class HomeCardsController < ApplicationController
	before_action :set_homecard, only: %i[ show ]

	def index
    	@homecards = HomeCard.all
    	render json: @homecards
  	end

	def show
    	render json: @homecard_result
  	end
  	
  	private
    # Use callbacks to share common setup or constraints between actions.
    	def set_homecard
      		homecard = HomeCard.find(params[:id])
      		playlist = homecard.playlist
      		contents = playlist.contents
      		contents_categories = []
      		contents.each do |content|
      			contents_categories << content.as_json.merge!({:categories => content.categories}.as_json)
      		end
      		@homecard_result = {:homecard => homecard, :playlist => playlist, :contents => contents_categories}
    	end
end