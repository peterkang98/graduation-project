class CreateCoupons < ActiveRecord::Migration[7.0]
  def change
    create_table :coupons,id: false, primary_key: :coupon_code do |t|
      t.primary_key :coupon_code, :string, limit: 20
      t.integer :coupon_time, null:false
    end

    create_table :coupon_usages, id: false do |t|
      t.bigint :user_id, null:false
      t.string :coupon_code, null:false
    end

    add_foreign_key :coupon_usages, :users, column: 'user_id', primary_key: 'id', on_delete: :cascade
    add_foreign_key :coupon_usages, :coupons, column: 'coupon_code', primary_key: 'coupon_code', on_delete: :cascade

    create_table :user_ratings, id: false do |t|
      t.bigint :user_id, null:false
      t.bigint :content_id, null:false
      t.decimal :rating, precision: 2, scale: 1, null:false
    end

    add_foreign_key :user_ratings, :users, column: 'user_id', primary_key: 'id', on_delete: :cascade
    add_foreign_key :user_ratings, :contents, column: 'content_id', primary_key: 'content_id', on_delete: :cascade

    create_table :watched_contents, id: false do |t|
      t.bigint :user_id, null:false
      t.bigint :content_id, null:false
    end

    add_foreign_key :watched_contents, :users, column: 'user_id', primary_key: 'id', on_delete: :cascade
    add_foreign_key :watched_contents, :contents, column: 'content_id', primary_key: 'content_id', on_delete: :cascade
  end
end
