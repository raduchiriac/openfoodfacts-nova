import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import InfiniteScroll from 'react-infinite-scroll-component';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

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
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing.unit * 6
  }
});

class IndexPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentProduct: '',
      previousProduct: '',
      selectedProduct: '',
      results: [],
      limit: 5,
      offset: 0
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.prettifyListOfStrings = this.prettifyListOfStrings.bind(this);
    this.fetchSomeMore = this.fetchSomeMore.bind(this);
  }

  handleChange = (evt) => {
    this.setState({ currentProduct: evt.target.value });
  };

  handleSubmit = (evt) => {
    evt.preventDefault();

    this.fetchSomeMore().then(res => this.setState(prevState => ({
      results: [...prevState.results, ...res]
    })));
  };

  fetchSomeMore = async ({ currentProduct, limit, offset } = this.state) => {
    const data = await fetch('/api/getProducts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product: currentProduct, limit, offset })
    })
      .then(response => response.json())
      .then(body => body)
      .catch((err) => {
        console.log('fetchSomeMore', err);
      });
    return data;
  };

  prettifyListOfStrings = list => list
    .split(',')
    .map(el => el.charAt(0).toUpperCase() + el.slice(1))
    .join(', ');

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <CssBaseline />
        <AppBar position="static" className={classes.appBar}>
          <Toolbar>
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
                value={this.state.currentProduct}
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
          {/* <InfiniteScroll
            dataLength={this.state.results.length}
            next={this.fetchSomeMore}
            hasMore
            loader={<h4>Loading...</h4>}
          > */}
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
                  <Card className={classes.card}>
                    <CardMedia
                      className={classes.cardMedia}
                      image={card.image_url}
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
          {/* </InfiniteScroll> */}
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
      </React.Fragment>
    );
  }
}

IndexPage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(IndexPage);
