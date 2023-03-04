class AddCardImagePathToHomeCards < ActiveRecord::Migration[7.0]
  def change
    add_column :home_cards, :card_image_path, :string
  end
end
