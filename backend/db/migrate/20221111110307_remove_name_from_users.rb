class RemoveNameFromUsers < ActiveRecord::Migration[7.0]
  def change
    remove_column :users, :name, :string
    remove_column :users, :membership_expire, :datetime
    remove_column :users, :membership_status, :boolean
    add_column :users, :username, :string, limit: 30
    add_column :users, :membership_enabled, :boolean
    add_column :users, :membership_time_left, :decimal, precision: 9, scale: 3
  end
end
