import React from 'react';
import './App.css';

import { makeStyles } from '@material-ui/core/styles';

//Cards of movies
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

// Header
import { fade } from '@material-ui/core/styles';
import {AppBar,Toolbar,InputBase} from '@material-ui/core';

// search and add field
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';

//create new movie dialog
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

//date picker
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

//image upload
import Input from '@material-ui/core/Input';


//image avtar
import Avatar from '@material-ui/core/Avatar';


import axios from "axios";


const useStyles = makeStyles(theme =>({
  card: {
    maxWidth: 280,
    width:280,
    margin:'5px'
  },
  listCard:{
  },
  media: {
    height: 140,
  },
  grow: {
    flexGrow: 1,
  },

  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: '0px',
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: "36%",
      width: 'auto',
    },
  },
  appBarStyle:{
    marginBottom:"10px"
  },
  addButton:{
    marginLeft:"6px"
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
  movieList:{
    paddingLeft:"60px"
  },
  bigAvatar: {
    margin:"5px",
    borderRadius:"2%",
    width: 160,
    height: 190,
  },
  uploadButton:{
    height:"30px",
    top:"50%"
  },
  avtarBox:{
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

function App() {
  const [cardList, setCardList] = React.useState(null);
  const [filteredCardList, setFilteredCardList] = React.useState(null);
  const [spacing, setSpacing] = React.useState(2);



  const [open, setOpen] = React.useState(false);
  const [selectedMovie, setSelectedMovie] = React.useState({});
  const [openDetailDialog, setOpenDetailDialog] = React.useState(false);
  const classes = useStyles();

  const getDataAxios = async () => {
    const response =
      await axios.get("http://localhost:8080/movies",
        { headers: { 'Content-Type': 'application/json' } }
      )
    console.log(response.data)
    setCardList(response.data);
    setFilteredCardList(response.data)
  }

  

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleOpenDetailDialog = (movie) => {
    setSelectedMovie(movie)
    setOpenDetailDialog(true);
  };
  const getMoviesList = () => {
    getDataAxios()
    };

  console.log("caliing")

  var movieObject = {
    name:'moviename',
    publisher:'',
    date:'',
    noofplayers:'',
    platform:'',
    genre:''
  }
  const handleClose = () => {
    setOpen(false);
  };
  const handleCloseDetailDialog = () => {
    setOpenDetailDialog(false);
  };
  





  const handleCreateMovie = () => {
     var movie = values
    axios.post(`http://localhost:8080/movies`, movie)
      .then(res => {
        console.log(res);
        console.log(res.data);
        getMoviesList()
        setOpen(false);
      })

  };

  // The first commit of Material-UI
  const [selectedDate, setSelectedDate] = React.useState();
  const [values, setValues] = React.useState({
    name: '',
    publisher: '',
    date: '',
    noofplayers: '',
    platform: '',
    genre: '',
    artbox:''
  });
  const handleDateChange = selecteddate => {
    var date = selecteddate
    var dd = date.getDate();
    var mm = date.getMonth() + 1;

    var yyyy = date.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    date = dd + '/' + mm + '/' + yyyy;
    values.date = date
    setSelectedDate(selecteddate);
  };
  const handleChange = prop => event => {
  setValues({ ...values, [prop]: event.target.value });
  };
  const searchMovie = event => {
    console.log(event.target.value)
    let result = cardList.filter(item=>{
      return item.name.includes(event.target.value)
    });
    setFilteredCardList(result)

  };
  const uploadPhoto = event => {

    var bodyFormData = new FormData();
    bodyFormData.append('photo', event.target.files[0]);

    axios({
      method: 'post',
      url: 'http://localhost:8080/upload',
      data: bodyFormData,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then(function (response) {
        //handle success
        setValues({ ...values, ['artbox']: response.data.filename });

        console.log(values.artbox);

      })
      .catch(function (response) {
        //handle error
        console.log(response);
      });
  };





  return (
    <div className="App">
      <AppBar position="static" color="primary" className={classes.appBarStyle}>
        <Toolbar>
          <Typography className={classes.title} variant="h6" noWrap>
            Movies
          </Typography>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              onChange={searchMovie}
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>
          <Button
            variant="contained"
            className={classes.addButton}
            
            onClick={getMoviesList}
          >
            get movies
      </Button>
          <Button
            variant="contained"
            className={classes.addButton}
            startIcon={<AddIcon />}
            onClick={handleClickOpen}
          >
            Add
      </Button>
          <div className={classes.grow} />
        </Toolbar>
      </AppBar>
<div className={classes.listCard}>



            <Grid container className={classes.root} spacing={2}>
              <Grid item xs={12}>
                <Grid container justify="center" spacing={spacing}>
              {filteredCardList && filteredCardList.map((movie, index) => {
                      return (
                        <Grid key={index} item>
                <div className="movieList" key={index}>
                  <Card className={classes.card} key={index}>
                    <CardActionArea>
                      <CardMedia
                        className={classes.media}
                        image={'http://localhost:8080/' + movie.artbox}
                        title="Contemplative Reptile"
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                          {movie.name}
                        </Typography>
                        {/* <Typography variant="body2" color="textSecondary" component="p">
                     Publisher:{movie.publisher}
                     Publisher:{movie.publisher}
              </Typography> */}
                      </CardContent>
                    </CardActionArea>
                    <CardActions>
                      <Button variant="outlined" onClick={() => { handleOpenDetailDialog(movie) }} className="fullbutton" color="primary">
                        View
          </Button>
                    </CardActions>
                  </Card>
                </div>
                      {/* <Paper className={classes.paper} /> */}
                    </Grid>
                    )
                     })}
                </Grid>
              </Grid>
              </Grid>

      </div>


      <Dialog open={openDetailDialog} onClose={handleCloseDetailDialog} aria-labelledby="movie-detail">
        <DialogTitle id="movie-detail">{selectedMovie?.name}</DialogTitle>
        <DialogContent>
          <Card className={classes.card} >
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image={'http://localhost:8080/' + selectedMovie?.artbox}
                title="Contemplative Reptile"
              />
              </CardActionArea>
              </Card>
          <label>Name : </label><b>{selectedMovie?.name}<b/></b><br/>
          <label>Publisher : </label><b>{selectedMovie?.publisher}<b/></b><br/>
          <label>Date : </label><b>{selectedMovie?.date}<b/></b><br/>
          <label>No Of Players : </label><b>{selectedMovie?.noofplayers}<b/></b><br/>
          <label>Genre : </label><b>{selectedMovie?.genre}<b/></b><br/>
          <label>Platform : </label><b>{selectedMovie?.platform}<b/></b><br/>
      
          
    
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Create new movie</DialogTitle>
        <DialogContent>
          <TextField
            value={values.name}
            onChange={handleChange("name")}
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
          />
          <TextField
            value={values.publisher}
            onChange={handleChange("publisher")}
            margin="dense"
            id="publisher"
            label="Publisher"
            type="text"
            fullWidth
          />
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container justify="space-around">
          <KeyboardDatePicker
            value={selectedDate}
            margin="normal"
            id="date"
            label="Date picker dialog"
            format="MM/dd/yyyy"
            onChange={handleDateChange}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
          </Grid>
            </MuiPickersUtilsProvider>
          <TextField
            value={values.noofplayers}
            onChange={handleChange("noofplayers")}
            margin="dense"
            id="noofplayers"
            label="No of players"
            type="number"
            fullWidth
          />
          <div className={classes.avtarBox}>
            <Avatar alt="Remy Sharp" src={'http://localhost:8080/' + values.artbox} className={classes.bigAvatar} />
            </div>
          <Button
          color="primary"
            variant="contained"
            component="label"
            className={classes.uploadButton}
          >
            Box Art(Photo Upload)
            <input
              onChange={uploadPhoto}
              accept="image/*"
              name="photo" 
              id="artbox"
              type="file"
              style={{ display: "none" }}
            />
          </Button>
    
          <TextField
            value={values.genre}
            onChange={handleChange("genre")}
            margin="dense"
            id="genre"
            label="Genre"
            type="text"
            fullWidth
          />
          <TextField
            value={values.platform}
            onChange={handleChange("platform")}
            margin="dense"
            id="platform"
            label="Platform"
            type="text"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreateMovie} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>



    </div>
  );
}

export default App;
