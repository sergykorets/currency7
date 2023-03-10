class Version < PaperTrail::Version
  after_create :acknowledge_cashiers

  def acknowledge_cashiers
    User.cashier.update_all(new_rates_acknowleged: false)
    ActionCable.server.broadcast 'rate_channel', {message: 'new_rates'}
  end
end