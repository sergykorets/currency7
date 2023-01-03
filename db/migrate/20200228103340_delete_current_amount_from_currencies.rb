class DeleteCurrentAmountFromCurrencies < ActiveRecord::Migration[5.1]
  def change
    remove_column :currencies, :current_amount, :decimal
  end
end
