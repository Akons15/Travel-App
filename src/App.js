import React, {useState, useEffect} from 'react';

import { CssBaseline, Grid } from '@material-ui/core';

import { getPlacesData, getWeatherData } from './api/index';
import Header from './components/Header';
import List from './components/List';
import Map from './components/Map';


const App = () => {
  const [places, setPlaces] = useState([]);
  const [weatherData, setWeatherData] = useState([]);

  const [coordinates, setCoordinates] = useState({});
  const [bounds, setBounds] = useState({});
  const [filteredPlaces, setFilteredPlaces] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [childClicked, setChildClicked] = useState(null);
  const [type, setType] = useState('restaurants');
  const [rating, setRating] = useState('');

  const [autocomplete, setAutocomplete] = useState(null);

  
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
      setCoordinates({ lat: latitude, lng: longitude });
    });
  }, []);

  useEffect(() => {
   const filterPlace = places.filter(place => place.rating > rating);
   setFilteredPlaces(filterPlace)
  },[rating])

  useEffect(() => {
    if(bounds.sw && bounds.ne) {
    setIsLoading(true)

    getWeatherData(coordinates.lat, coordinates.lng)
    .then((data) => setWeatherData(data))

    getPlacesData(type, bounds.sw, bounds.ne)
    .then((data) => {
      console.log(data)
      setPlaces(data?.filter(place => place.name && place.num_reviews > 0));
      setFilteredPlaces([])
      setIsLoading(false)
    });
  }
  }, [type, bounds]);

  console.log(places)


  const onLoad = (autoC) => setAutocomplete(autoC);

  const onPlaceChange = () => {
    const lat = autocomplete.getPlace().geometry.location.lat();
    const lng = autocomplete.getPlace().geometry.location.lng();

    setCoordinates({lat, lng})
  }

  return (
    <>
    <CssBaseline />
    <Header setCoordinates={setCoordinates} onLoad={onLoad} onPlaceChange={onPlaceChange}/>
    <Grid container spacing={3} style={{ width: '100%' }}>

      <Grid item xs={12} md={4}>
        <List places={filteredPlaces.length ? filteredPlaces : places}
        childClicked={childClicked}
        isLoading={isLoading}
        type={setType}
        setType={setType}
        rating={rating}
        setRating={setRating}/>
      </Grid>

      <Grid item xs={12} md={8}>
      <Map setCoordinates={setCoordinates}
        setBounds={setBounds}
        coordinates={coordinates}
        places={filteredPlaces.length ? filteredPlaces : places}
        setChildClicked={setChildClicked}
        weatherData={weatherData}/>
      </Grid>

    </Grid>
    </>
  );
}

export default App;