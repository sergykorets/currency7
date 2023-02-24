class ChangeRateChannel < ApplicationCable::Channel
  def subscribed
    stream_from "change_rate_channel"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
