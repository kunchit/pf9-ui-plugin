import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography
} from '@material-ui/core'
import CloudDownloadIcon from '@material-ui/icons/CloudDownload'
import { rootPath } from 'core/globals'

const styles = theme => ({
  card: {
    display: 'flex',
    marginTop: theme.spacing.unit * 2.5,
    padding: theme.spacing.unit * 3
  },
  details: {
    display: 'flex',
    flexDirection: 'column'
  },
  content: {
    flex: '1 0 auto',
    paddingTop: 0
  },
  cover: {
    width: 120,
    height: 120
  },
  root: {
    flexGrow: 1,
  },
  icon: {
    marginRight: theme.spacing.unit * 0.5
  },
  text: {
    display: 'inline-block',
    marginRight: theme.spacing.unit * 0.5
  }
})

class ImageCard extends React.Component {
  render () {
    const { classes, image } = this.props
    return (
      <Card className={classes.card}>
        <div align="center">
          <CardMedia
            className={classes.cover}
            image={rootPath+image.icon}
            title="logo"
          />
          <Typography variant="subheading" color="textSecondary">{image.os}</Typography>
          <Button href={image.location}>
            <CloudDownloadIcon color="primary" className={classes.icon} />
            <Typography>Download</Typography>
          </Button>
        </div>
        <div className={classes.details}>
          <CardContent className={classes.content}>
            <Typography variant="headline" paragraph>{image.name}</Typography>
            <Typography variant="subheading" color="textSecondary" paragraph>
              {image.description}
            </Typography>
            <br />
            <Grid container className={classes.root} spacing={8}>
              <Grid item sm={3}>
                <Typography variant="body2" className={classes.text}>Disk Format: </Typography>
                <Typography variant="body1" className={classes.text} paragraph>{image.disk_format}</Typography>
                <br />
                <Typography variant="body2" className={classes.text}>Image Size: </Typography>
                <Typography variant="body1" className={classes.text}>{image.size}</Typography>
              </Grid>
              <Grid item sm={6}>
                <Typography variant="body2" className={classes.text}>MD5sum: </Typography>
                <Typography variant="body1" className={classes.text} paragraph>{image.md5sum}</Typography>
                <br />
                <Typography variant="body2" className={classes.text}>Default User: </Typography>
                <Typography variant="body1" className={classes.text}>{image.default_user} </Typography>
              </Grid>
              <Grid item sm={3}>
                <Typography variant="body2" className={classes.text}>Default Password: </Typography>
                <Typography variant="body1" className={classes.text}>{image.default_password}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </div>
      </Card>
    )
  }
}

export default withStyles(styles)(ImageCard)