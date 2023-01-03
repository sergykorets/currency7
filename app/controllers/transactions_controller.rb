class TransactionsController < ApplicationController
  before_action :authenticate_user!
  before_action :check_user

  def index
    actions = Action.exchange
    @count = actions.count
    @actions = actions.order('created_at DESC').page(params[:page] || 1).per(10).each_with_object({}) { |action, hash|
      hash[action.id] = { id: action.id,
                          number: action.number,
                          currency_buy: action.sell_currency.name,
                          currency_sell: action.buy_currency.name,
                          buy_amount: action.buy_amount,
                          sell_amount: action.sell_amount,
                          rate: action.rate,
                          comment: action.comment,
                          is_canceled: action.canceled,
                          created_at: action.created_at.strftime('%d.%m.%Y %H:%M')}
    }
    @todays_transactions_count = actions.where('created_at >= ?', Date.today.beginning_of_day).count
    @admin = current_user&.admin?
    respond_to do |format|
      format.html { render :index }
      format.json {{actions: @actions, count: @count, todays_transactions_count: @todays_transactions_count }}
    end
  end

  def cancel
    action = Action.find(params[:id])
    if action.created_at.to_date == Date.current && action.update(canceled: true)
      render json: { success: true,
                     actions: Action.exchange.order('created_at DESC').page(params[:page] || 1).per(10).each_with_object({}) { |action, hash|
                       hash[action.id] = { id: action.id,
                                           number: action.number,
                                           currency_buy: action.sell_currency.name,
                                           currency_sell: action.buy_currency.name,
                                           buy_amount: action.buy_amount,
                                           sell_amount: action.sell_amount,
                                           rate: action.rate,
                                           comment: action.comment,
                                           is_canceled: action.canceled,
                                           created_at: action.created_at.strftime('%d.%m.%Y %H:%M')}
                     }
      }
    else
      render json: {success: false}
    end
  end

  private

  def check_user
    head :no_content if current_user.simple?
  end
end