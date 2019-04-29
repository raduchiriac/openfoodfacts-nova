import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CircularProgress from '@material-ui/core/CircularProgress';
import CssBaseline from '@material-ui/core/CssBaseline';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import { withStyles } from '@material-ui/core/styles';
import withRoot from '../withRoot';

const styles = theme => ({
  appBar: {
    position: 'relative'
  },
  heroUnit: {
    padding: '1em',
    backgroundColor: theme.palette.background.paper
  },
  heroContent: {
    maxWidth: 600,
    margin: '0 auto',
    padding: `${theme.spacing.unit * 1}px 0 ${theme.spacing.unit * 2}px`
  },
  heroButtons: {
    marginTop: theme.spacing.unit * 4
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
      width: 1100,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  centerContent: {
    justifyContent: 'center'
  },
  circularProgress: {
    margin: `${theme.spacing.unit * 2}px 0`
  },
  cardGrid: {
    padding: `${theme.spacing.unit * 4}px 0`
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  cardTitle: {
    lineHeight: 1
  },
  gridItem: {
    flex: '0 0 100%'
  },
  cardMedia: {
    paddingTop: '56.25%' // 16:9
  },
  cardContent: {
    flexGrow: 1
  },
  searchField: {},
  form: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    width: 'fit-content'
  },
  formControl: {
    marginTop: theme.spacing.unit * 2,
    minWidth: 120
  },
  formControlLabel: {
    marginTop: theme.spacing.unit
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing.unit * 6
  }
});

class IndexPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      product: '',
      productSearched: '',
      productSelected: {},
      results: [],
      limit: 10,
      offset: 0,
      loading: false,
      hasMore: false,
      drawer: false,
      dialog: false
    };
    this.fetchSomeMore = this.fetchSomeMore.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleOnScroll = this.handleOnScroll.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleToggleDrawer = this.handleToggleDrawer.bind(this);
    this.prettifyListOfStrings = this.prettifyListOfStrings.bind(this);
    this.handleDialogOpen = this.handleDialogOpen.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
  }

  handleDialogOpen = (id) => {
    const productSelected = this.state.results.find(obj => obj._id === id);
    this.setState({ dialog: true, productSelected });
  };

  handleDialogClose = () => {
    this.setState({ dialog: false, productSelected: {} });
  };

  handleChange = (evt) => {
    this.setState({ product: evt.target.value.trim() });
  };

  handleSubmit = (evt) => {
    evt.preventDefault();
    if (this.state.product.length) {
      this.setState(
        prevState => ({ productSearched: prevState.product.trim() }),
        () => {
          this.fetchSomeMore().then(results => this.setState({
            results,
            hasMore: results.length === this.state.limit,
            offset: results.length
          }));
        }
      );
    }
  };

  handleToggleDrawer = (state) => {
    // this.setState({
    //   drawer: state
    // });
  };

  handleOnScroll = () => {
    const scrollTop = (document.documentElement && document.documentElement.scrollTop)
      || document.body.scrollTop;
    const scrollHeight = (document.documentElement && document.documentElement.scrollHeight)
      || document.body.scrollHeight;
    const clientHeight = document.documentElement.clientHeight || window.innerHeight;
    const scrolledToBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;

    if (
      scrolledToBottom
      && this.state.productSearched.length
      && this.state.hasMore
    ) {
      this.fetchSomeMore().then(res => this.setState((prevState) => {
        if (res.length) {
          const concatenatedProducts = [...prevState.results, ...res];
          return {
            results: concatenatedProducts,
            offset: concatenatedProducts.length
          };
        }
        return {
          hasMore: false
        };
      }));
    }
  };

  fetchSomeMore = async ({ productSearched, limit, offset } = this.state) => {
    this.setState({ loading: true });
    const data = await fetch('/api/getProducts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product: productSearched, limit, offset })
    })
      .then(response => response.json())
      .then((body) => {
        this.setState({ loading: false });
        return body;
      })
      .catch((err) => {
        console.log(`Error on fetchSomeMore(): ${err}`);
      });
    return data;
  };

  prettifyListOfStrings = list => list
    .split(',')
    .map(
      el => el
        .trim()
        .charAt(0)
        .toUpperCase() + el.slice(1)
    )
    .join(', ');

  componentDidMount = () => {
    window.addEventListener('scroll', this.handleOnScroll);
  };

  componentWillUnmount = () => {
    window.removeEventListener('scroll', this.handleOnScroll);
  };

  render() {
    const { classes } = this.props;
    const restrictedFields = [
      'creator',
      'product_name',
      '_id',
      'url',
      'image_url',
      'image_small_url',
      'image_front_url',
      'image_front_small_url',
      'image_ingredients_url',
      'image_nutrition_url',
      'image_ingredients_small_url',
      'image_nutrition_small_url'
    ];

    return (
      <React.Fragment>
        <CssBaseline />
        <AppBar position="static" className={classes.appBar}>
          <Toolbar>
            <IconButton color="inherit" aria-label="Open drawer">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" noWrap>
              Open Food Facts
            </Typography>
          </Toolbar>
        </AppBar>
        <main>
          <div className={classes.heroUnit}>
            <form className={classes.heroContent} onSubmit={this.handleSubmit}>
              <TextField
                id="search-field"
                className={classes.searchField}
                variant="outlined"
                label="Product"
                value={this.state.product}
                onChange={this.handleChange}
                fullWidth
              />
              <div className={classes.heroButtons}>
                <Grid container spacing={16} justify="center">
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={this.handleSubmit}
                    >
                      Search
                    </Button>
                  </Grid>
                </Grid>
              </div>
            </form>
          </div>
          <div className={classNames(classes.layout, classes.cardGrid)}>
            <Grid container spacing={16} className={classes.centerContent}>
              {this.state.results.map(card => (
                <Grid
                  item
                  key={card.code}
                  xs={12}
                  sm={12}
                  md={6}
                  lg={4}
                  className={classes.gridItem}
                >
                  <Card
                    className={classes.card}
                    onClick={() => this.handleDialogOpen(card._id)}
                  >
                    <CardMedia
                      className={classes.cardMedia}
                      image={card.image_small_url}
                      title={card.code}
                    />
                    <CardContent className={classes.cardContent}>
                      <Typography
                        className={classes.cardTitle}
                        gutterBottom
                        variant="h6"
                        component="h6"
                      >
                        {card.product_name}
                      </Typography>
                      {card.stores.length > 0 && (
                        <Typography>
                          <strong>Stores: </strong>
                          {this.prettifyListOfStrings(card.stores)}
                        </Typography>
                      )}
                      {card.origins.length > 0 && (
                        <Typography>
                          <strong>Origin: </strong>
                          {this.prettifyListOfStrings(card.origins)}
                        </Typography>
                      )}
                      <Typography>{card.ingredients}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
              {this.state.loading && (
                <Grid
                  sm={12}
                  md={12}
                  lg={12}
                  item
                  className={classes.circularProgress}
                >
                  <CircularProgress />
                </Grid>
              )}
            </Grid>
          </div>
        </main>
        <Dialog
          fullWidth
          fullScreen
          open={this.state.dialog}
          onClose={this.handleDialogClose}
          aria-labelledby="max-width-dialog-title"
        >
          <DialogTitle id="max-width-dialog-title">
            {this.state.productSelected.product_name || ''}
          </DialogTitle>
          <DialogContent>
            <Button type="button" onClick={this.handleDialogClose}>
              <img
                style={{ width: '100%' }}
                alt=""
                src={this.state.productSelected.image_url}
              />
            </Button>
            {Object.keys(this.state.productSelected)
              .filter(el => !!this.state.productSelected[el].length)
              .filter(el => restrictedFields.indexOf(el) < 0)
              .map(key => (
                <Typography
                  color="textSecondary"
                  key={key}
                  component="p"
                  noWrap
                >
                  <strong>{`${key}: `}</strong>
                  {`${this.prettifyListOfStrings(
                    this.state.productSelected[key]
                  )}`}
                </Typography>
              ))}
            <DialogContentText />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleDialogClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}

IndexPage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRoot(withStyles(styles)(IndexPage));
