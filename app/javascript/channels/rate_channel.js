import consumer from "./consumer"
import React from "react"
import { createRoot } from "react-dom/client"
import Acknowledgment from '../components/Acknowledgment'

consumer.subscriptions.create("ChangeRateChannel", {
  connected() {
    // Called when the subscription is ready for use on the server
  },

  disconnected() {
    // Called when the subscription has been terminated by the server
  },

  received() {
    const cashier_acknowledgment = document.getElementById('cashier_acknowledgment');
    const d = document.createElement("div");
    d.id = 'new_rates_acknowledgment';
    const root = createRoot(d);
    cashier_acknowledgment.appendChild(d);
    root.render(<Acknowledgment/>)
  }
});
