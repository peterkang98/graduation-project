class AddNumberOfSeasonsToContents < ActiveRecord::Migration[7.0]
  def change
    add_column :contents, :number_of_seasons, :integer, limit: 2
  end
end
