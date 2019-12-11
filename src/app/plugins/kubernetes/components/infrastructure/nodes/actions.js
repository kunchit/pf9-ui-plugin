import createContextLoader from 'core/helpers/createContextLoader'
import createContextUpdater from 'core/helpers/createContextUpdater'
import ApiClient from 'api-client/ApiClient'
import { serviceCatalogContextKey } from 'openstack/components/api-access/actions'
import { pathStrOrNull, pipeWhenTruthy } from 'utils/fp'
import { find, propEq, prop } from 'ramda'
import { combinedHostsCacheKey } from 'k8s/components/infrastructure/common/actions'

const { resmgr, qbert } = ApiClient.getInstance()

export const nodesCacheKey = 'nodes'
export const rawNodesCacheKey = 'rawNodes'
export const combinedHostsCacheKey = 'combinedHosts'

createContextLoader(rawNodesCacheKey, async () => {
  return qbert.getNodes()
}, {
  entityName: 'Node',
  uniqueIdentifier: 'uuid',
})

export const loadNodes = createContextLoader(nodesCacheKey, async (params, loadFromContext) => {
  console.log('loadNodes was called')
  const [rawNodes, combinedHosts, serviceCatalog] = await Promise.all([
    loadFromContext(rawNodesCacheKey),
    loadFromContext(combinedHostsCacheKey),
    loadFromContext(serviceCatalogContextKey),
  ])

  console.log(combinedHosts)

  const combinedHostsObj = combinedHosts.reduce(
    (accum, host) => {
      const id = pathStrOrNull('resmgr.id')(host) || pathStrOrNull('qbert.uuid')(host)
      accum[id] = host
      return accum
    },
    {},
  )

  const qbertUrl = pipeWhenTruthy(
    find(propEq('name', 'qbert')),
    prop('url'),
  )(serviceCatalog) || ''

  // associate nodes with the combinedHost entry
  return rawNodes.map(node => ({
    ...node,
    combined: combinedHostsObj[node.uuid],
    // qbert v3 link fails authorization so we have to use v1 link for logs
    logs: `${qbertUrl}/logs/${node.uuid}`.replace(/v3/, 'v1'),
  }))
}, {
  refetchCascade: true,
  uniqueIdentifier: 'uuid',
})

export const deAuthNode = createContextUpdater('nodes', async (node, prevItems) => {
  await resmgr.unauthorizeHost(node.uuid)
  // Something in `createContextUpdater` is refreshing the API calls for nodes automagically.
  // This what I would be doing manually so it works out fine but I'm a bit concerned
  // that it is not being invoked explicitly from within this action.
  return prevItems
}, {
  successMessage: ([node]) => `Successfully de-authorized node ${node.name} (${node.primaryIp})`,
})

// Important: How do I get this function to also trigger a nodes list refresh?
export const updateRemoteSupport = createContextUpdater(combinedHostsCacheKey, async (data, currentItems) => {
  const { id, enableSupport } = data
  const host = currentItems.find(x => x.id === id)
  const supportRoleName = 'pf9-support'
  // If the role push/delete fails, how do I handle that?
  // Temporary solution using the pre-existing host object
  // Future solution will require consumption of pf9-notifications for reactive updates
  if (enableSupport) {
    await resmgr.pushRole(id, supportRoleName)
    return {
      ...host,
      roles: [...host.roles, supportRoleName],
      roleStatus: 'converging',
      uiState: 'pending',
      supportRole: true
    }
  } else {
    await resmgr.removeRole(id, supportRoleName)
    return {
      ...host,
      roles: host.roles.filter(role => role !== supportRoleName),
      roleStatus: 'converging',
      uiState: 'pending',
      supportRole: false
    }
  }
}, { operation: 'update' })
