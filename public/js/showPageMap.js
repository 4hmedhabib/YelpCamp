mapboxgl.accessToken = mapToken;
var map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11',
    center: campground.geometry.coordinates,
    zoom: 8
});

new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
        .setHTML(
            `<h4>${campground.title}</h4><p>${campground.location}</p>`
        )
    )
    .addTo(map)