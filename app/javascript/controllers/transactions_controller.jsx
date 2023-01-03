import { Controller } from "@hotwired/stimulus"
import React from "react"
import { createRoot } from 'react-dom/client'
import Transactions from '../components/Transactions'

export default class extends Controller {
  static targets = ['transactions'];

  connect() {
    const actions = this.transactionsTarget.dataset.actions;
    const admin = this.transactionsTarget.dataset.admin;
    const count = this.transactionsTarget.dataset.count;
    const todays_transactions_count = this.transactionsTarget.dataset.todays_transactions_count;
    const app = document.getElementById('transactions');
    createRoot(app).render(<Transactions actions={actions} admin={admin} count={count} todays_transactions_count={todays_transactions_count}/>)
  }
}
