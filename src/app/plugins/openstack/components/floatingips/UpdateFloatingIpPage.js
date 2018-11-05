import React from 'react'
import createUpdateComponents from 'core/createUpdateComponents'
import SubmitButton from 'core/common/SubmitButton'
import ValidatedForm from 'core/common/ValidatedForm'
import TextField from 'core/common/TextField'
import { updateFloatingIp, loadFloatingIps } from './actions'

export const UpdateFloatingIpForm = ({ onComplete, initialValue }) => (
  <ValidatedForm onSubmit={onComplete} initialValue={initialValue}>
    <TextField id="floating_ip_address" label="Floating IP Address" />
    <TextField id="fixed_ip_address" label="Fixed IP Address" />
    <SubmitButton>Update Floating IP</SubmitButton>
  </ValidatedForm>
)

export const options = {
  FormComponent: UpdateFloatingIpForm,
  routeParamKey: 'floatingIpId',
  updateFn: updateFloatingIp,
  loaderFn: loadFloatingIps,
  listUrl: '/ui/openstack/floatingips',
  name: 'UpdateFloatingIp',
  title: 'Update Floating IP',
}

const { UpdatePage } = createUpdateComponents(options)

export default UpdatePage