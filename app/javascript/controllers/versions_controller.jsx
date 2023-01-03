import { Controller } from "@hotwired/stimulus"
import React from "react"
import { createRoot } from 'react-dom/client'
import Versions from '../components/Versions'

export default class extends Controller {
  static targets = ['versions'];

  connect() {
    const versions = this.versionsTarget.dataset.versions;
    const count = this.versionsTarget.dataset.count;
    const app = document.getElementById('versions');
    createRoot(app).render(<Versions versions={versions} count={count}/>)
  }
}
