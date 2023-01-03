class CreateActions < ActiveRecord::Migration[5.1]
  def change
    create_table :actions do |t|
      t.integer :action_type
      t.integer :currency_id_buy
      t.integer :currency_id_sell
      t.integer :currency_id
      t.decimal :amount
      t.decimal :buy_amount
      t.decimal :sell_amount
      t.decimal :rate
      t.text :comment
      t.timestamps
    end
  end
end
