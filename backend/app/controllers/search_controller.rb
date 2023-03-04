class SearchController < ApplicationController
  	def show
  		if params[:title].empty?
  			render json:{}, status: 404
  		else
  			result_orig = Content.where("replace(LOWER(original_title), ' ', '') like ?", "%#{params[:title]}%")
  			result_kor = Content.where("replace(LOWER(korean_title), ' ', '') like ?", "%#{params[:title]}%")
  			render json: {:result => result_orig.or(result_kor).order("korean_title ASC")}, status: 200
  		end
  	end
end