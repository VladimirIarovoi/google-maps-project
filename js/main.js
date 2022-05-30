let map;
let marker = false;
let geocoder;
let response;
let drawingManager;
let polygonsCoords = [];
const sideBar = document.querySelector('.side-bar');
const exportButton = document.querySelector('.export-btn');
let polygonsCoordsPoint = 0;

const removeLine = () => {
    const lastOverlay = polygonsCoords.pop();
    if (lastOverlay) lastOverlay.setMap(null);
}

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
            exportButton.classList.remove('active');
            sideBar.classList.remove('active');
        } else {
            sideBar.classList.add('active');
            sideBar.classList.add('active');
            addListButton.classList.add('active');
            exportButton.classList.add('active');
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

            return results;

        })
        .catch(function (e) {
            alert("Geocode was not successful for the following reason: " + e);
        });
}

const exportToExcel = (response) => {
    exportButton.addEventListener('click', item => {
        console.log(response.childNodes)
        let exp = []
        response.childNodes.forEach(item => {
            exp.push(item)
        })


        let CsvString = "";

        exp.forEach(function (ColItem) {
            CsvString += ColItem.innerText + ",";

            CsvString += "\r\n";
        });
        CsvString = "data:application/csv," + encodeURIComponent(CsvString);
        let x = document.createElement("A");
        x.setAttribute("href", CsvString);
        x.setAttribute("download", "data.csv");
        document.body.appendChild(x);
        x.click();
    })
}


const initMap = ()  => {

    const centerOfMap = new google.maps.LatLng(52.357971, -6.516758);

    const options = {
      center: centerOfMap,
      zoom: 7
    };

    map = new google.maps.Map(document.querySelector('#map'), options);

    geocoder = new google.maps.Geocoder();

    drawingManager = new google.maps.drawing.DrawingManager({
        //drawingMode: google.maps.drawing.OverlayType.MARKER,
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [
                google.maps.drawing.OverlayType.POLYGON,
            ],
        },
        markerOptions: {
            icon: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
        },
        circleOptions: {
            fillColor: "#ffff00",
            fillOpacity: 1,
            strokeWeight: 5,
            clickable: false,
            editable: true,
            zIndex: 1,
        },
    });
    drawingManager.setMap(map);

    response = document.createElement('p')
    response.id = "response";
    response.innerText = "";

    console.log(response)
    exportToExcel(response)

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

    google.maps.event.addListener(drawingManager, 'overlaycomplete', function(event) {
        polygonsCoords.push(event.overlay);
        console.log(event.overlay.getPath().getArray());
        const polygonPositions = event.overlay.getPath().getArray()
        polygonPositions.forEach(item => {

            console.log(item.lat)
            var latlng = new google.maps.LatLng(item);
            // This is making the Geocode request
            geocoder.geocode({ 'latLng': latlng },  (results, status) =>{
                if (status !== google.maps.GeocoderStatus.OK) {
                    alert(status);
                }
                if (status == google.maps.GeocoderStatus.OK) {
                    let address = (results[0].formatted_address);
                    console.log(address)
                    // response.append(address);
                    // sideBar.append(response);

                    let newAddress = document.createElement('li')
                    newAddress.classList.add('side-bar__item')
                    newAddress.append(address);
                    response.append(newAddress);
                    sideBar.append(response)
                }
            });

        })

    });


    const undo = document.querySelector('#undo');
    undo.addEventListener("click",removeLine);
}


window.initMap = initMap();
