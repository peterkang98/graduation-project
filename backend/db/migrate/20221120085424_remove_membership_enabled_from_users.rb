class RemoveMembershipEnabledFromUsers < ActiveRecord::Migration[7.0]
  def change
    remove_column :users, :membership_enabled, :boolean
  end
end
