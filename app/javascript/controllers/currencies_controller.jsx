import { Controller } from "@hotwired/stimulus"
import React from "react"
import { createRoot } from 'react-dom/client'
import Currencies from '../components/Currencies'

export default class extends Controller {
  static targets = ['currencies'];

  connect() {
    const currencies = this.currenciesTarget.dataset.currencies;
    const admin = this.currenciesTarget.dataset.admin;
    const app = document.getElementById('currencies');
    createRoot(app).render(<Currencies currencies={currencies} admin={admin} />)
  }
}
