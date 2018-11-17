import React from 'react'
import PropTypes from 'prop-types'
import moize from 'moize'
import { AppBar, IconButton } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import MenuIcon from '@material-ui/icons/Menu'
import classNames from 'classnames'
import { rootPath } from 'core/globals'
import Selector from 'core/common/Selector'
import TenantChooser from 'openstack/components/tenants/TenantChooser'
import Avatar from 'core/common/Avatar'
import MaterialToolbar from '@material-ui/core/Toolbar/Toolbar'
import { drawerWidth } from 'core/common/Navbar'

const styles = theme => ({
  appBar: {
    position: 'absolute',
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  'appBarShift-left': {
    marginLeft: drawerWidth,
  },
  'appBarShift-right': {
    marginRight: drawerWidth,
  },
  menuButton: {
    marginLeft: theme.spacing.unit * 1.5,
    marginRight: theme.spacing.unit,
  },
  hide: {
    display: 'none',
  },
  logo: {
    maxHeight: theme.spacing.unit * 6.5,
  },
  rightTools: {
    position: 'absolute',
    right: theme.spacing.unit * 2,
    display: 'flex',
    alignItems: 'center',
  }
})

@withStyles(styles, { withTheme: true })
class Toolbar extends React.Component {
  state = {
    open: true,
    anchor: 'left',
    curRegion: '',
    regionSearch: '',
    expandedItems: [],
    filterText: '',
  }

  handleSearch = moize(key => value => {
    this.setState({
      [key]: value
    })
  })

  handleClick = moize(key => event => {
    this.setState({
      [key]: event.target.innerText
    })
  })

  render () {
    const { classes, open, handleDrawerOpen } = this.props
    const { curRegion, regionSearch } = this.state
    const logoPath = rootPath + 'images/logo.png'

    return <AppBar className={classNames(classes.appBar, {
      [classes.appBarShift]: open,
      [classes['appBarShift-left']]: open,
    })}>
      <MaterialToolbar disableGutters={!open}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          className={classNames(classes.menuButton, open && classes.hide)}
        >
          <MenuIcon />
        </IconButton>
        <img src={logoPath} className={classes.logo} align="middle" />
        <div className={classes.rightTools}>
          <Selector
            name={curRegion.length === 0 ? 'Current Region' : curRegion}
            list={[`AWS-US-West-1-Test`, `KVM-Neutron`]}
            onChoose={this.handleClick('curRegion')}
            onSearchChange={this.handleSearch('regionSearch')}
            searchTerm={regionSearch}
          />
          <TenantChooser />
          <Avatar />
        </div>
      </MaterialToolbar>
    </AppBar>
  }
}

Toolbar.propTypes = {
  open: PropTypes.bool,
  handleDrawerOpen: PropTypes.func,
}

export default Toolbar