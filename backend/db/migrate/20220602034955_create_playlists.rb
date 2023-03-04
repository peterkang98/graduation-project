class CreatePlaylists < ActiveRecord::Migration[7.0]
  def change
    create_table :playlists, id: false, primary_key: :playlist_id do |t|
      t.primary_key :playlist_id, :integer
      t.string :playlist_title, limit: 50, null:false
      t.text :playlist_description
    end
  end
end
