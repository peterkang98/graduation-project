class AddingForeignKey < ActiveRecord::Migration[7.0]
  def change
    add_foreign_key :playlist_contents, :contents, column: 'content_id', primary_key: 'content_id', on_delete: :cascade
    add_foreign_key :playlist_contents, :playlists, column: 'playlist_id', primary_key: 'playlist_id', on_delete: :cascade
  end
end
