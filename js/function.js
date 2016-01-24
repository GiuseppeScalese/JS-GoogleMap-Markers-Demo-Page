//check whether or not namespace exist
var MyApp = MyApp || {};

//create my app namespace
var MyApp = (function(){
 
  //create an array to contain new marker info-window
  var infos = [];

  //private method - creates city markers and show them on map
  var _createMarkers = function (map, shape, image, locationData) {

    var markersArray = [];

    //loop through the JSON and create markers for each location given
    for ( var i = 0; i < locationData.locations.length; i++) {

      var location = locationData.locations[i];

      //create marker for each location - it is given position, map, icon and shape of the icon
      var myLatLng = new google.maps.LatLng(parseFloat(locationData.locations[i].lat), parseFloat(locationData.locations[i].lng));
      var marker = new google.maps.Marker({
          position: myLatLng,
          map: map,
          icon: locationData.locations[i].image,
          shape: shape,
          people: locationData.locations[i].people,
          location: locationData.locations[i].name
      });

      //add locations into array
      markersArray.push(location);

      //marker info to be injected in the DOM
      var contentString = '<span class="employee-info">In '+marker.location+ ' there are '+marker.people+' employees</span>';

      //create info window object to show users' info
      var infowindow = new google.maps.InfoWindow({
            content: contentString,
            maxWidth: 200
      });

      //add event listener to each marker and handle the click
      _addListenersToMarkers(map, marker, contentString, infowindow, location); 

    }

    return markersArray;
  }


  //private method - closes the infoWindow previously opened
  var _closeInfos = function (){
   
     if(infos.length > 0){
        // detach the info-window from the marker
        infos[0].set("marker", null);
   
        //and close it
        infos[0].close();
   
        //blank the array
        infos.length = 0;
     }
  }


  //private method - add event listener to each marker and handle its click
  var _addListenersToMarkers = function (map, marker, contentString, infowindow, location){
 
       //handles click on multiple markers
        google.maps.event.addListener(marker,'click', (function(marker,contentString,infowindow){ 

          return function() {          
              // close the previous info-window 
              _closeInfos();
    
              infowindow.setContent(contentString);
              infowindow.open(map,marker);
    
              //keep the handle, in order to close it on next click event
              infos[0]=infowindow;                     
          }

        })(marker,contentString,infowindow));   
  }


  //private method - set markers variables
  var _setMarkers = function (map) {
      
    // Add markers to the map
    // Marker sizes are expressed as a Size of X,Y
    // where the origin of the image (0,0) is located
    // in the top left of the image.

    // Origins, anchor positions and coordinates of the marker
    // increase in the X direction to the right and in
    // the Y direction down.
    var image = {
      url: 'img/marker1_icon.png',
      // This marker is 20 pixels wide by 32 pixels tall.
      size: new google.maps.Size(51, 67),
      // The origin for this image is 0,0.
      origin: new google.maps.Point(0,0),
      // The anchor for this image is the base of the flagpole at 0,32.
      anchor: new google.maps.Point(0, 32)
    };

    // Shapes define the clickable region of the icon.
    // The type defines an HTML &lt;area&gt; element 'poly' which
    // traces out a polygon as a series of X,Y points. The final
    // coordinate closes the poly by connecting to the first
    // coordinate.
    var shape = {
       coords: [20, 3, 1, 80, 88, 20, 1, 1],
        type: 'poly'
    };

    //create marker icon object for each location
    var iconBase = 'img/';
    var icons = {
      madrid: {
        icon: iconBase + 'marker4_icon.png'
      },
      london: {
        icon: iconBase + 'marker3_icon.png'
      },
      zurich: {
        icon: iconBase + 'marker1_icon.png'
      },
      budapest: {
        icon: iconBase + 'marker2_icon.png'
      }
    };

    //JSON to retrieve location info
    var locationData = { "locations" : [ 
    { "name":"Madrid" , "lat":"40.4167754", "lng":"-3.7037902", "people":"4", "image":icons.madrid.icon},
    { "name":"Zurich" , "lat":"47.3768866", "lng":"8.541694", "people":"10", "image":icons.zurich.icon },
    { "name":"London" , "lat":"51.5073509", "lng":"-0.1277583","people":"23", "image":icons.london.icon},
    { "name":"Budapest" , "lat":"47.497912", "lng":"19.040235","people":"6", "image":icons.budapest.icon}]};

    //create markers and show them on map
    _createMarkers(map, shape, image, locationData);  
  };


  //private method - load the google map on screen
  var _initialiseMap = function () {

    //function to retrieve map from google - Europe coordinates are being used with zoom level 5 - alternatively, use google geo location to check your position automatically
    var mapOptions = {
      center: { lat: 47.5230557, lng: 5.9884754}, 
      zoom: 5
    };

    var map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);

    //set markers variables
    _setMarkers(map);
      
  }


  //public method - handles the form submit
  var loadMap = function () {

    //initialise and load map on screen
    _initialiseMap();
      
  };

  return {
      loadMap : loadMap
  };

})();

 MyApp.loadMap();
