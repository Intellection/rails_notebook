class CreateProducts < ActiveRecord::Migration
  def change
    create_table :products do |t|
      t.string :name
      t.integer :quantity
      t.integer :discount
      t.references :order, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
