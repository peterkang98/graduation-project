class RatingsController < ApplicationController
	def show
		rating = UserRating.where('user_id = ?', current_user.id)
		if rating.blank?
			render json: {:message => "no rating"}, status: 200
		else
			contents = []
			rating.each do |rated_content|
				contents << rated_content.content.as_json.merge!(rated_content.as_json)
			end
			render json: {:rated => contents}, status: 200
		end
	end
	def rate
		content = Content.find(params[:content_id])
		rating_history = UserRating.where('user_id = ? AND content_id = ?', current_user.id, params[:content_id]).first
		if rating_history.blank?
			UserRating.create(user_id: current_user.id, content_id: params[:content_id], rating: params[:rating])
			content.average_rating = (((content.average_rating*content.rating_count)+params[:rating])/(content.rating_count+1)).round(1)
			content.rating_count+=1
			content.save
		else
			old_val = rating_history.rating
			content.average_rating = ((((content.average_rating*content.rating_count)-old_val)+params[:rating])/content.rating_count).round(1)
			if content.average_rating > 5.0
				content.average_rating = 5.0
			end
			content.save
			ActiveRecord::Base.connection.execute(
				"UPDATE \"user_ratings\" SET \"rating\"=#{params[:rating]} WHERE \"user_ratings\".\"user_id\" = #{current_user.id} AND \"user_ratings\".\"content_id\" = #{params[:content_id]}")
		end
		render json: {:message => "success"}, status: 200
  	end
end