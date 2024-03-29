class MembersController < ApplicationController
	before_action :authenticate_user!

	def show
		user = get_user_from_token
		render json:{
			message: "You're in",
			user: user
		}
	end

	def count
		user = User.find(current_user.id)
		time_left = (user.membership_time_left - params[:time]).round(3)
		if time_left < 0
			user.membership_time_left = 0
			render json:{message: "membership expired"}, status: 409
		else
			user.membership_time_left = time_left
			render json:{}, status: 200
		end
		user.save
	end

	private
	def get_user_from_token
		jwt_payload = JWT.decode(request.headers['Authorization'].split(' ')[1],
			Rails.application.credentials.devise[:jwt_secret_key]).first
		user_id = jwt_payload["sub"]
		user = User.find(user_id.to_s)
	end
end