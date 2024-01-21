let map;
let markers = [];

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 0, lng: 0 },
        zoom: 2,
    });

    const viewButton = document.getElementById('viewButton');
    const addButton = document.getElementById('addButton');
    const clearButton = document.getElementById('clearScreen');


    clearButton.addEventListener('click', onClearButtonClick);

    viewButton.addEventListener('click', () =>
     {
                // Check if user location is already stored in localStorage
                  console.log('View button clicked');
                const storedUserLocation = JSON.parse(localStorage.getItem("userLocation"));

                if (storedUserLocation) {
                    // If stored location is available, use it without prompting for permission
                    fetchMarkersWithin2km(storedUserLocation);
                } else if (navigator.geolocation) {
                    // If stored location is not available, attempt to get the user's current location
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            const userLocation = {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude,
                            };

                            // Save the user's location in localStorage
                            localStorage.setItem("userLocation", JSON.stringify(userLocation));

                            // Fetch markers within 2 km from the user's location
                            fetchMarkersWithin2km(userLocation);
                        },
                        (error) => {
                            console.error("Error getting user location:", error);
                        }
                    );
                } else {
                    console.error("Geolocation is not supported by this browser.");
                }
            });


   addButton.addEventListener('click', () => {
        const description = prompt('Enter a description for this location:');
        if (description) {
            addMarker(map.getCenter(), description);
        }
    });

  google.maps.event.addListener(map, 'click', function(event) {
      // Open a prompt to get the description from the user
      const description = prompt('Enter a description for this location:');

      // Check if the user entered a description
      if (description) {
          // Display a marker at the clicked location with the entered description
          displayMarker(event.latLng, description);
      }
  });

    // Check if user location is already stored in localStorage
        const storedUserLocation = JSON.parse(localStorage.getItem("userLocation"));

        if (storedUserLocation) {
            // If stored location is available, use it without prompting for permission
            setMapToUserLocation(map, storedUserLocation);
        } else if (navigator.geolocation) {
            // If stored location is not available, attempt to get the user's current location
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };

                    // Save the user's location in localStorage
                    localStorage.setItem("userLocation", JSON.stringify(userLocation));

                    // Set the map to the user's location
                    setMapToUserLocation(map, userLocation);
                },
                (error) => {
                    console.error("Error getting user location:", error);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }

}

function addMarker(location, description) {
    // Add your marker creation code here...

    // Send a POST request to add the marker to the backend
    const markerData = {
        latitude: location.lat(),
        longitude: location.lng(),
        description: description
    };

    fetch('http://localhost:8080/api/markers/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(markerData),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        // Optionally, you can update the map or provide user feedback
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function setMapToUserLocation(map, userLocation) {
    // Set the map center to the user's location
    map.setCenter(userLocation);

    // Adjust the zoom level for street-level view
    map.setZoom(20);

    // Optionally, you can add a marker at the user's location
    const userMarker = new google.maps.Marker({
        position: userLocation,
        map: map,
        title: "Your Location",
    });
}

function fetchMarkersWithin2km(userLocation) {
    const { lat, lng } = userLocation;

    // Make a GET request to fetch all markers
    fetch('http://localhost:8080/api/markers')
        .then(response => response.json())
        .then(markersData => {
            // Clear existing markers on the map
            clearMarkers();

            // Filter markers that are within 2 km
            const markersWithin2km = markersData.filter(marker => calculateDistance(lat, lng, marker.latitude, marker.longitude) <= 2);

            // Display markers on the map
            markersWithin2km.forEach(marker => {
               addMarkerOnMap({ lat: marker.latitude, lng: marker.longitude }, marker.description);
            });
        })
        .catch(error => {
            console.error('Error fetching markers:', error);
        });
}

function addMarkerOnMap(location, description) {
    const marker = new google.maps.Marker({
        position: location,
        map: map,
        title: description,
    });

    // Store the marker in the markers array
    markers.push(marker);

    // Optionally, you can add click event listener to display the description
    marker.addListener('click', function() {
        alert('Description: ' + description);
    });
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
}

function toRadians(degrees) {
    return degrees * Math.PI / 180;
}

function clearMarkers() {
    // Clear existing markers from the map
    markers.forEach(marker => marker.setMap(null));
    markers = [];
}
function onClearButtonClick() {
    // Clear existing markers from the map
    clearMarkers();
}

function displayMarker(location, description) {
    const marker = new google.maps.Marker({
        position: location,
        map: map,
        title: description,
    });

    // Store the marker in the markers array
    markers.push(marker);
}
