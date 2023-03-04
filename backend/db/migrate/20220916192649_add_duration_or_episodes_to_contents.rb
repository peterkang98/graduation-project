class AddDurationOrEpisodesToContents < ActiveRecord::Migration[7.0]
  def change
    add_column :contents, :duration_or_episodes, :integer, limit: 2
  end
end
