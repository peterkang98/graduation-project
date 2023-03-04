class Coupon < ApplicationRecord
	self.primary_key = 'coupon_code'
	has_and_belongs_to_many :users, join_table: 'coupon_usages'
end
