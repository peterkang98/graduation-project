class CreateEpisodes < ActiveRecord::Migration[7.0]
  def change
    create_table :episodes, primary_key: :episode_id do |t|
      t.bigint :season_id, null:false
      t.integer :episode_number, limit: 2, null:false
      t.string :episode_title
      t.integer :duration, limit: 2, null:false
      t.string :video_path, null:false
    end

    add_foreign_key :episodes, :tv_show_seasons, column: 'season_id', primary_key: 'season_id', on_delete: :cascade
    add_index :episodes, :season_id
  end
end
