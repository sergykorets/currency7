class RenameTotalAmountToCurrentAmountInCurrencies < ActiveRecord::Migration[5.1]
  def change
    rename_column :currencies, :total_amount, :current_amount
  end
end
