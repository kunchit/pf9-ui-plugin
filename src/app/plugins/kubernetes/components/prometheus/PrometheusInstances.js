import React from 'react'
import ExternalLink from 'core/components/ExternalLink'
import createCRUDComponents from 'core/helpers/createCRUDComponents'
import { deletePrometheusInstance, loadPrometheusInstances } from './actions'

const renderKeyValues = obj => Object.entries(obj)
  .map(([key, value]) => `${key}: ${value}`)
  .join(', ')

const renderClusterName = (field, row, data) => {
  const cluster = data.clusters.find(x => x.uuid === row.clusterUuid)
  return cluster.name
}

const renderDashboardLink = (field, row, context) => {
  const link = context.apiClient.qbert.getPrometheusDashboardLink(row)
  return <ExternalLink url={link}>dashboard</ExternalLink>
}

export const columns = [
  { id: 'name', label: 'Name' },
  { id: 'clusterName', label: 'cluster', render: renderClusterName },
  { id: 'namespace', label: 'Namespace' },
  { id: 'dashboard', label: 'Dashboard', render: renderDashboardLink },
  { id: 'serviceMonitorSelector', label: 'Service Monitor', render: renderKeyValues },
  { id: 'alertManagersSelector', label: 'Alert Managers' },
  { id: 'cpu', label: 'CPU' },
  { id: 'storage', label: 'Storage' },
  { id: 'memory', label: 'Memory' },
  { id: 'retention', label: 'Retention' },
  { id: 'version', label: 'version' },
  { id: 'replicas', label: '# of instances' },
]

export const options = {
  addUrl: '/ui/kubernetes/prometheus/instances/add',
  columns,
  dataKey: 'prometheusInstances',
  deleteFn: deletePrometheusInstance,
  editUrl: '/ui/kubernetes/prometheus/instances/edit',
  loaderFn: loadPrometheusInstances,
  name: 'PrometheusInstances',
  title: 'Prometheus Instances',
  uniqueIdentifier: 'uid',
}

const { ListPage, List } = createCRUDComponents(options)
export const PrometheusInstancesList = List

export default ListPage