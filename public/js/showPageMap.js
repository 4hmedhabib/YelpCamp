mapboxgl.accessToken = mapToken;
var map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11',
    center: campground.geometry.coordinates,
    zoom: 8
});

new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .addTo(map)