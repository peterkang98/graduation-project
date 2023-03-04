class UpdateForeignKey < ActiveRecord::Migration[7.0]
  def change
    remove_foreign_key :movies, column: 'movie_id'
    add_foreign_key :movies, :contents, column: 'movie_id', primary_key: 'content_id', on_delete: :cascade
  end
end
