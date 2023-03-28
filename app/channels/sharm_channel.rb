class SharmChannel < ApplicationCable::Channel
  def subscribed
    stream_from "sharm_channel"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
