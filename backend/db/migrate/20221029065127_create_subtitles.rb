class CreateSubtitles < ActiveRecord::Migration[7.0]
  def change
    create_table :subtitles do |t|
      t.integer :episode_id
      t.integer :movie_id
      t.string :language, limit: 3
      t.string :subtitle_path
      
    end
    add_index :contents, :original_title
    add_index :contents, :korean_title
    add_foreign_key :subtitles, :movies, column: 'movie_id', primary_key: 'movie_id'
    add_foreign_key :subtitles, :episodes, column: 'episode_id', primary_key: 'episode_id'
  end
end
