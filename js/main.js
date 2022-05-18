let map;
let marker = false;

const markerLocation = () => {
    const currentLocation = marker.getPosition();
    document.querySelector('#lat').value = currentLocation.lat();
    document.querySelector('#lng').value = currentLocation.lng();
}
        
const initMap = ()  => {

    const centerOfMap = new google.maps.LatLng(52.357971, -6.516758);

    const options = {
      center: centerOfMap,
      zoom: 7
    };

    map = new google.maps.Map(document.querySelector('#map'), options);

    google.maps.event.addListener(map, 'click', (event) => {
        const clickedLocation = event.latLng;
        if(!marker){
            marker = new google.maps.Marker({
                position: clickedLocation,
                map: map,
                draggable: true
            });

            marker.addEventListener("dragend",() => {
                markerLocation;
            });
        } else{
            marker.setPosition(clickedLocation);
        }
        markerLocation();  
    });
}

window.initMap = initMap();