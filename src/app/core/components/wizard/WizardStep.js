import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { withWizardContext } from 'core/components/wizard/Wizard'

class WizardStep extends PureComponent {
  componentDidMount () {
    const { addStep, stepId, label } = this.props
    addStep({ stepId, label })
  }

  render () {
    const { stepId, activeStepId, children } = this.props
    return stepId === activeStepId ? children : null
  }
}

// Validations should be an object with a rule definition
WizardStep.propTypes = {
  stepId: PropTypes.string.isRequired,
  label: PropTypes.string,
}

export default withWizardContext(WizardStep)
