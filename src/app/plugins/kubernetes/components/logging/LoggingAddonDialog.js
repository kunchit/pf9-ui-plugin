
import React, { useCallback } from 'react'
import { castFuzzyBool } from 'utils/misc'
import { compose, path } from 'ramda'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core'
import ApiClient from 'api-client/ApiClient'
import useDataUpdater from 'core/hooks/useDataUpdater'
import { clusterActions } from '../infrastructure/clusters/actions'

export const hasLoggingEnabled = compose(castFuzzyBool, path(['tags', 'pf9-system:logging']))

const { appbert } = ApiClient.getInstance()

const LoggingAddonDialog = ({ rows: [cluster], onClose }) => {
  const enabled = hasLoggingEnabled(cluster)
  const [tagUpdater] = useDataUpdater(clusterActions.updateTag, success => {
    if (success) {
      onClose()
    }
  })

  const toggleLogging = useCallback(async () => {
    try {
      const pkgs = await appbert.getPackages()
      const logPkg = pkgs.find(pkg => (
        pkg.name === 'pf9-log'
      ))

      if (!logPkg) {
        console.log('no logging package found')
        return
      }

      const logId = logPkg.ID
      await appbert.toggleAddon(cluster.uuid, logId, !enabled)
    } catch (e) {
      // TODO: Raise toaster notification
      console.log(e)
    }

    const val = !enabled
    const key = 'pf9-system:logging'
    tagUpdater({ cluster, key, val })
  }, [tagUpdater, cluster, enabled])

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>Logging Add-On (Beta)</DialogTitle>
      <DialogContent>
        <p>
          <b>Note:</b> Logging is a Beta feature
        </p>
        <p>
          After enabling logging add-on, you will be able to forward logs generated by Kubernetes components and user applications
          to log datastores such as Elasticsearch and S3.
        </p>
      </DialogContent>
      <DialogActions>
        <Button color="primary" type="submit" variant="contained" onClick={toggleLogging}>
          {enabled ? 'Disable' : 'Enable'}
        </Button>
        <Button variant="contained" onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default LoggingAddonDialog
