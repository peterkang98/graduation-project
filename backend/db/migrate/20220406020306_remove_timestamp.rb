class RemoveTimestamp < ActiveRecord::Migration[7.0]
  def change
    remove_timestamps :contents
  end
end
