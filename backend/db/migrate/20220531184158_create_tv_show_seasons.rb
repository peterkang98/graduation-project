class CreateTvShowSeasons < ActiveRecord::Migration[7.0]
  def change
    create_table :tv_show_seasons, primary_key: :season_id do |t|
      t.bigint :content_id, null:false
      t.integer :season_number, limit: 2, null: false
      t.integer :number_of_episodes, limit: 2, null: false
      t.string :season_full_title
      t.string :season_type_name, limit: 10
      t.string :season_poster_path
    end

    add_foreign_key :tv_show_seasons, :contents, column: 'content_id', primary_key: 'content_id', on_delete: :cascade
    add_index :tv_show_seasons, :content_id
  end
end
