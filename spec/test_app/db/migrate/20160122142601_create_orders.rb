class CreateOrders < ActiveRecord::Migration
  def change
    create_table :orders do |t|
      t.datetime :order_date
      t.string :status
      t.references :customer, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
