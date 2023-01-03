class CreateBalances < ActiveRecord::Migration[5.1]
  def change
    create_table :balances do |t|
      t.integer :currency_id
      t.decimal :interim_balance
      t.timestamps
    end
  end
end
