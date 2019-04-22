import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  whiteNoWrap: {
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden'
  },
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
      drawer: false,
      dialog: false,
      limit: 5,
      offset: 0
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
    this.setState({ product: evt.target.value });
  };

  handleSubmit = (evt) => {
    evt.preventDefault();
    this.setState({ productSearched: this.state.product.trim() });

    this.fetchSomeMore().then(results => this.setState({
      results,
      offset: results.length
    }));
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

    if (scrolledToBottom && this.state.productSearched.length) {
      this.fetchSomeMore().then(res => this.setState((prevState) => {
        const concatenatedProducts = [...prevState.results, ...res];
        return {
          results: concatenatedProducts,
          offset: concatenatedProducts.length
        };
      }));
    }
  };

  fetchSomeMore = async ({ productSearched, limit, offset } = this.state) => {
    const data = await fetch('/api/getProducts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product: productSearched, limit, offset })
    })
      .then(response => response.json())
      .then(body => body)
      .catch((err) => {
        console.log(`Error on fetchSomeMore(): ${err}`);
      });
    return data;
  };

  prettifyListOfStrings = list => list
    .split(',')
    .map(
      el => el
        .charAt(0)
        .toUpperCase()
        .trim() + el.slice(1)
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
                label="Produit"
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
                      Rechercher
                    </Button>
                  </Grid>
                </Grid>
              </div>
            </form>
          </div>
          <div className={classNames(classes.layout, classes.cardGrid)}>
            <Grid container spacing={40}>
              {this.state.results.map(card => (
                <Grid
                  item
                  key={card.code}
                  sm={6}
                  md={4}
                  lg={3}
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
                        component="h5"
                      >
                        {card.product_name}
                      </Typography>
                      {card.stores.length > 0 && (
                        <Typography>
                          <strong>Magasins: </strong>
                          {this.prettifyListOfStrings(card.stores)}
                        </Typography>
                      )}
                      {card.origins.length > 0 && (
                        <Typography>
                          <strong>Origine: </strong>
                          {this.prettifyListOfStrings(card.origins)}
                        </Typography>
                      )}
                      <Typography>{card.ingredients}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </div>
        </main>
        <footer className={classes.footer}>
          <Typography
            variant="subtitle1"
            align="center"
            color="textSecondary"
            component="p"
          >
            Last update: 4 weeks ago
          </Typography>
        </footer>
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
            <img
              onClick={this.handleDialogClose}
              style={{ width: '100%' }}
              alt=""
              src={this.state.productSelected.image_url}
            />
            {Object.keys(this.state.productSelected)
              .filter(el => this.state.productSelected[el].length > 0)
              .map(key => (
                <Typography
                  color="textSecondary"
                  key={key}
                  component="p"
                  className={classes.whiteNoWrap}
                >
                  <strong>{`${key}: `}</strong>
                  {`${this.state.productSelected[key]}`}
                </Typography>
              ))}
            <DialogContentText />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleDialogClose} color="primary">
              Fermer
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

export default withStyles(styles)(IndexPage);
