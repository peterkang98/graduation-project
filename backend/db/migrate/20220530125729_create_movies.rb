class CreateMovies < ActiveRecord::Migration[7.0]
  def change
    create_table :movies, id: false, primary_key: :movie_id do |t|
      t.primary_key :movie_id
      t.integer :duration, limit: 2
      t.string :video_path
    end

    add_foreign_key :movies, :contents, column: 'movie_id', primary_key: 'content_id'
  end
end
