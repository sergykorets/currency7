class CreateCurrencies < ActiveRecord::Migration[5.1]
  def change
    create_table :currencies do |t|
      t.string :name
      t.decimal :buy_price
      t.decimal :sell_price
      t.decimal :total_amount
    end
  end
end
