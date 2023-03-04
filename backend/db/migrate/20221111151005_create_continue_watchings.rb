class CreateContinueWatchings < ActiveRecord::Migration[7.0]
  def change
    create_table :continue_watchings do |t|
      t.bigint :user_id, null: false
      t.bigint :episode_id
      t.bigint :movie_id
      t.decimal :resume_time, precision: 6, scale: 3, null: false
    end

    add_index :continue_watchings, :user_id
    add_foreign_key :continue_watchings, :movies, column: 'movie_id', primary_key: 'movie_id'
    add_foreign_key :continue_watchings, :episodes, column: 'episode_id', primary_key: 'episode_id'
    add_foreign_key :continue_watchings, :users, column: 'user_id', primary_key: 'id'
  end
end
