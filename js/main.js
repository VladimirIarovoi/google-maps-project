let map;
let marker = false;
let geocoder;
let response;
const sideBar = document.querySelector('.side-bar');

const markerLocation = () => {
    const currentLocation = marker.getPosition();
    document.querySelector('#lat').value = currentLocation.lat();
    document.querySelector('#lng').value = currentLocation.lng();
}

const sideBarCreate = () => {
    const addListButton = document.querySelector('.add-side-bar');
    addListButton.addEventListener('click', () => {
        if (addListButton.classList.contains('active')) {
            addListButton.classList.remove('active');
            sideBar.classList.remove('active');
        } else {
            sideBar.classList.add('active');
            addListButton.classList.add('active');
        }
    })
}

const geocode = (request) => {
    geocoder
        .geocode(request)
        .then(function (result) {
            var results = result.results;
            map.setCenter(results[0].geometry.location);
            marker.setPosition(results[0].geometry.location);
            marker.setMap(map);
            let newAddress = document.createElement('li')
            newAddress.classList.add('side-bar__item')
            newAddress.append(results[0].formatted_address);
            response.append(newAddress);
            console.log(result);
            return results;
        })
        .catch(function (e) {
            alert("Geocode was not successful for the following reason: " + e);
        });
}
        
const initMap = ()  => {

    const centerOfMap = new google.maps.LatLng(52.357971, -6.516758);

    const options = {
      center: centerOfMap,
      zoom: 7
    };

    map = new google.maps.Map(document.querySelector('#map'), options);
    geocoder = new google.maps.Geocoder();

    response = document.createElement('p')
    response.id = "response";
    response.innerText = "";


    google.maps.event.addListener(map, 'click', (event) => {
        const clickedLocation = event.latLng;
        geocode({ location: clickedLocation }); 
        if(!marker){
            marker = new google.maps.Marker({
                position: clickedLocation,
                map: map,
                draggable: true
            });

            marker.addListener("dragend",() => {
                markerLocation;
            });
        } else{
            marker.setPosition(clickedLocation);
        }
        markerLocation();
        sideBar.append(response);
    });
    
    sideBarCreate();
}

window.initMap = initMap();