import { Controller } from "@hotwired/stimulus"
import React from "react"
import { createRoot } from 'react-dom/client'
import Actions from '../components/Actions'

export default class extends Controller {
  static targets = ['actions'];

  connect() {
    const actions = this.actionsTarget.dataset.actions;
    const admin = this.actionsTarget.dataset.admin;
    const count = this.actionsTarget.dataset.count;
    const app = document.getElementById('actions');
    createRoot(app).render(<Actions actions={actions} admin={admin} count={count} />)
  }
}
