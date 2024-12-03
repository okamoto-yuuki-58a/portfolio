import React from 'react'
import ReactDOM from 'react-dom'
import PlanEditor from '../components/plan-editor'

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('plan-editor')
  if (container) {
    ReactDOM.render(<PlanEditor />, container)
  }
})