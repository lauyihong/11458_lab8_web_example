// ADD YOUR MAPBOX ACCESS TOKEN
mapboxgl.accessToken = "pk.eyJ1IjoibGl1eWYyMyIsImEiOiJjbTB2YWsxOXcxYmRnMmtweGs0NnBlanI0In0.jCm_cti9TONkgaSYCT-Srg"

// CREATE A NEW OBJECT CALLED MAP
const map = new mapboxgl.Map({
  container: "map", // container ID for the map object (this points to the HTML element)
  style: "mapbox://styles/liuyf23/cm0vclne1007401ntd2rk098n", //YOUR STYLE URL
  center: [-73.9442, 40.6482], // starting position [lng, lat]
  zoom: 11, // starting zoom
  projection: "globe", // display the map as a 3D globe
});


map.on('load', () => {
  // Add a GeoJSON source from the API endpoint
  map.addSource('mongoLayer', {
    type: 'geojson',
    data: 'https://lab8-11485-d24492e3c3ec.herokuapp.com/api/geojson' // Replace with your API endpoint
  });

  // Add a layer to display the MongoDB data
  map.addLayer({
    id: 'mongoLayer',
    type: 'circle', // You can change this to 'line' or 'fill' based on your data
    source: 'mongoLayer',
    paint: {
      'circle-radius': 5,
      'circle-color': '#007cbf'
    }
  });


  // Step 3: Create a pop-up instance
    const popup = new mapboxgl.Popup({
      closeButton: false, // Disable close button
      closeOnClick: false, // Keep pop-up open when clicking elsewhere
      className: 'custom-popup' // Add your custom class name
  });

  // Step 4: Add mouseenter event to show the pop-up
  map.on('mouseenter', 'mongoLayer', (e) => {
      // Change the cursor to a pointer to indicate interactivity
      map.getCanvas().style.cursor = 'pointer';

      // Extract the coordinates and properties of the hovered point
      const coordinates = e.features[0].geometry.coordinates.slice();
      const properties = e.features[0].properties;

      // Set the content of the pop-up
      popup.setLngLat(coordinates)
          .setHTML(`
              <h3>Name: ${properties.name || 'Unknown Location'}</h3>
              <p>info: ${properties.notes || 'No additional information'}</p>
          `)
          .addTo(map);
  });

    // Step 5: Add mouseleave event to remove the pop-up
    map.on('mouseleave', 'mongoLayer', () => {
      // Reset the cursor style
      map.getCanvas().style.cursor = '';
      // Remove the pop-up
      popup.remove();
  });

});
