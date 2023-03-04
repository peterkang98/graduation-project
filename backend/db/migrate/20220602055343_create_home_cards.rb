class CreateHomeCards < ActiveRecord::Migration[7.0]
  def change
    create_table :home_cards, id: false, primary_key: :card_id do |t|
      t.primary_key :card_id, :integer
      t.bigint :content_id
      t.integer :playlist_id
      t.string :card_title, limit: 50, null:false
      t.string :card_subtitle, limit: 50
      t.string :card_description, null:false

    end

    add_foreign_key :home_cards, :contents, column: 'content_id', primary_key: 'content_id', on_delete: :cascade
    add_index :home_cards, :content_id

    add_foreign_key :home_cards, :playlists, column: 'playlist_id', primary_key: 'playlist_id', on_delete: :cascade
    add_index :home_cards, :playlist_id
  end
end
