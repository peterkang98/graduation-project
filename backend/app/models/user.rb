class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable,
         jwt_revocation_strategy: JwtDenylist

  has_many :continue_watchings, foreign_key: "user_id", primary_key: "id"
  has_and_belongs_to_many :coupons, join_table: 'coupon_usages'
  has_many :user_ratings, primary_key: 'id', foreign_key: 'user_id'
end
