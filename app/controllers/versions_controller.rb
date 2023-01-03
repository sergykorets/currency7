class VersionsController < ApplicationController
  before_action :authenticate_user!
  before_action :check_user

  def index
    versions = Version.all.order('created_at DESC')
    @count = versions.count
    @versions = versions.page(params[:page] || 1).per(10).map do |version|
      { currency: Currency.find(version.item_id).name,
        currency_buy_change_rate: version.changeset['buy_price'],
        currency_sell_change_rate: version.changeset['sell_price'],
        created_at: version.created_at.strftime('%d.%m.%Y %H:%M')}
    end
    respond_to do |format|
      format.html { render :index }
      format.json {{versions: @versions, count: @count }}
    end
  end

  private

  def check_user
    head :no_content if current_user.simple?
  end
end