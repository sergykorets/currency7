class ActionsController < ApplicationController
  before_action :authenticate_user!
  before_action :check_user

  def index
    actions = Action.where(action_type: [:collection, :replenishment]).order('created_at DESC')
    @count = actions.count
    @actions = actions.page(params[:page] || 1).per(10).map do |action|
      { id: action.id,
        action_type: action.action_type,
        currency: action.cashdesk_currency.name,
        amount: action.amount,
        comment: action.comment,
        created_at: action.created_at.strftime('%d.%m.%Y %H:%M')
      }
    end
    @admin = current_user&.admin?
    respond_to do |format|
      format.html { render :index }
      format.json {{actions: @actions, count: @count }}
    end
  end

  private

  def check_user
    head :no_content if current_user.simple?
  end
end