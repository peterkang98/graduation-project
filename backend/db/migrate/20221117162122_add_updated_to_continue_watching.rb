class AddUpdatedToContinueWatching < ActiveRecord::Migration[7.0]
  def change
    add_column :continue_watchings, :updated, :timestamp
  end
end
