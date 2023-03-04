class CreateTimestamps < ActiveRecord::Migration[7.0]
  def change
    create_table :timestamps do |t|
      t.integer :episode_id
      t.integer :movie_id
      t.decimal :start_time, precision: 6, scale: 3
      t.decimal :end_time, precision: 6, scale: 3
      t.string :ts_type, limit: 10
    end
    add_foreign_key :timestamps, :movies, column: 'movie_id', primary_key: 'movie_id'
    add_foreign_key :timestamps, :episodes, column: 'episode_id', primary_key: 'episode_id'
  end
end
