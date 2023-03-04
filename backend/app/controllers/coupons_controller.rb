class CouponsController < ApplicationController
	def apply
		coupon = Coupon.find(params[:code])
		
		usage = CouponUsage.where('coupon_code=? AND user_id=?', coupon.coupon_code, current_user.id)
		if usage.blank?
			user = User.find(current_user.id)
			user.membership_time_left += coupon.coupon_time
			user.save
			CouponUsage.create(user_id: current_user.id, coupon_code: coupon.coupon_code)
			render json: {:message => "success", :coupon => coupon}
		else
			render json: {:message => "already used"}, status: :unauthorized
		end
		
  	end
end