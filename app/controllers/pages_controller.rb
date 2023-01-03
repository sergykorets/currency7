class PagesController < ApplicationController
  layout 'pages'

  def index
    @currencies = Currency.where.not(name: 'UAH').sort_by(&:created_at)
    @last_update = Version.last.created_at.strftime('%d.%m.%Y %H:%M')
    @admin = current_user&.admin? || current_user&.cashier?
    pageview = Pageview.first
    pageview.increment!(:count) unless @admin
    @pageviews = pageview.count
  end
end
