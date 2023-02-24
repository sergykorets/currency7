class RateChannel < ApplicationCable::Channel
  def subscribed
    stream_from "rate_channel"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
