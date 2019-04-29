import * as React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import withRoot from '../withRoot';

const styles = theme => ({
  circularProgress: {
    margin: `${theme.spacing.unit * 2}px 0`
  }
});

const Loading = (props) => {
  const { classes } = props;
  return (
    <Grid item className={classes.circularProgress}>
      <CircularProgress />
    </Grid>
  );
};

Loading.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRoot(withStyles(styles)(Loading));
