/*!
 * Javascript Google map with xmal download and autocomplete search from xml
 * Created 20/04/2019 by Ujah Peter Chigozie Block BlockByte Tech LTD Nigeria
 * Version 1.0
*/
var autocomplete;
var markerz = [];
function initGoogleMap() {

	  var map = new google.maps.Map(document.getElementById((typeof settings.mapElementId === "undefined" ? "map" : settings.mapElementId)), {
		zoom: (typeof settings.current.zoom === "undefined" ? true : settings.current.zoom),
		center: (typeof settings.current.center === "undefined" ? true : settings.current.center),
		mapTypeControl: (typeof settings.customize.mapTypeControl === "undefined" ? true : settings.customize.mapTypeControl),
		panControl: (typeof settings.customize.panControl === "undefined" ? true : settings.customize.panControl),
		zoomControl: (typeof settings.customize.zoomControl === "undefined" ? true : settings.customize.zoomControl),
		streetViewControl: (typeof settings.customize.streetViewControl === "undefined" ? true : settings.customize.streetViewControl),
		clickableIcons: (typeof settings.customize.clickableIcons === "undefined" ? true : settings.customize.clickableIcons),
		fullscreenControl: (typeof settings.customize.fullscreenControl === "undefined" ? true : settings.customize.fullscreenControl)
	});
		
	
	var input = document.getElementById((typeof settings.searchElementId === "undefined" ? "serchLocation" : settings.searchElementId));
	var infoWindow = new google.maps.InfoWindow;
	autocomplete = new google.maps.places.Autocomplete(input);
	autocomplete.bindTo('bounds', map);
	autocomplete.setComponentRestrictions({'country': settings.current.country}); 
	if(settings.customize.placeSearchInMapBox){
		map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
	}
    blockByteGoogleMap.copyright(map, google.maps);
	autocomplete.addListener('place_changed', function() {
		var place = autocomplete.getPlace();
		if (!place.geometry) {
			return;
		}
		/*removeMarker.removeMarker();*/
		markerz.forEach(function(marker) {
			marker.setMap(null);
		});

		if (place.geometry.viewport) {
			map.fitBounds(place.geometry.viewport); 
			map.panToBounds(place.geometry.viewport); 
		} else {
			map.setZoom(16);
		}
	    map.setCenter(place.geometry.location); 
		
		var point = new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng());
		var marker = new google.maps.Marker({
			  map: map,
			  position: point,
			  icon: {
					url: settings.icons.ripple,
					scaledSize: new google.maps.Size(300, 300), 
					origin: new google.maps.Point(0,0), 
					anchor: new google.maps.Point(150,150)
				},
			  label: ""
		});
			
		markerz.push(marker);
		blockByteGoogleMap.fillInAddress(place);

		var _city =  document.getElementById("locality").value,
		_state =  document.getElementById("administrative_area_level_1").value,
		_country =  document.getElementById("country").value,
		_url = encodeURI(settings.onChangeUrlApi+"change=true&city="+_city+"&country="+_country+"&state="+_state);
		
		 localStorage.setItem("city", _city);
		 localStorage.setItem("state", _state);
		 localStorage.setItem("country", _country);

		 blockByteGoogleMap.fetch(_url, true).then(function(data){
			 var xml;
			 if(typeof data === "object" ){
				 xml = ((typeof data.responseXML != "undefined" && data.responseXML.length) ? data.responseXML : data);
			 }else if(typeof data === "string"){
				 var parser = new DOMParser();
				// xmlText = JSON.parse(data).responseText;
				 xmlText = data;
				 xml = parser.parseFromString(xmlText,"text/xml");
			 }

			if(typeof xml != "undefined" && xml != null){
				var markers = xml.documentElement.getElementsByTagName('marker');
				blockByteGoogleMap.createInfoWindow(map, markers, "onChange", infoWindow);
			 }
		 });
		 
	  /*Set the position of the marker using the place ID and location.*/
		marker.setPlace({
			placeId: place.place_id,
			location: place.geometry.location
		});
		marker.setVisible(true);
	});


	var _gcity = localStorage.getItem("city"),
		 _gstate = localStorage.getItem("state"),
		 _country = localStorage.getItem("country"),
		 _rurl = encodeURI(settings.onLoadUrlApi+"ready=true&city="+_gcity+"&country="+_country+"&state="+_gstate);
		 
	blockByteGoogleMap.fetch(_rurl, true).then(function(data){
		 var xml;
			 if(typeof data === "object" ){
				xml = ((typeof data.responseXML != "undefined" && data.responseXML.length) ? data.responseXML : data);
			 }else if(typeof data === "string"){
				  var parser = new DOMParser();
				   //xmlText = JSON.parse(data).responseText;
				   xmlText = data;
				 xml = parser.parseFromString(xmlText,"text/xml");
			 }
			 if(typeof xml != "undefined" && xml != null){
				var markers = xml.documentElement.getElementsByTagName('marker');
				blockByteGoogleMap.createInfoWindow(map, markers, "onLoad", infoWindow);
			}
	});
}


var blockByteGoogleMap = {
	statics: {
		componentForm: {
			route: 'long_name',
			locality: 'long_name',
			administrative_area_level_1: 'short_name',
			country: 'long_name'
		}
	},
	fillInAddress: function(place) {
        for (var component in this.statics.componentForm) {
          document.getElementById(component).value = '';
          document.getElementById(component).disabled = false;
        }
        for (var i = 0; i < place.address_components.length; i++) {
          var addressType = place.address_components[i].types[0];
          if (this.statics.componentForm[addressType]) {
            var val = place.address_components[i][this.statics.componentForm[addressType]];
            document.getElementById(addressType).value = val;
          }
        }
    },
	  
	geolocate: function() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var geolocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            var circle = new google.maps.Circle({
              center: geolocation,
              radius: position.coords.accuracy
            });
            autocomplete.setBounds(circle.getBounds());
          });
        }
    },
	
	fetch: function(url) {
		  return new Promise(function(resolve, reject) {
			var req = window.ActiveXObject ? new ActiveXObject('Microsoft.XMLHTTP') : new XMLHttpRequest;
			req.open('GET', url);

			//req.onreadystatechange = function() {
			req.onload = function() {
				if (req.status == 200) {
					//request.onreadystatechange = blockByteGoogleMap.doNothing;
					resolve(req.response);
				}else {
					reject(Error(req.statusText));
				}
			};
			req.onerror = function() {
				reject(Error("Network Error"));
			};
			req.send();
		  });
	},

	copyright: function(map, maps){
		var row = document.createElement('div');
		var alink = document.createElement('a');
		var span = document.createElement('span');
		var br = document.createElement('br');
		row.setAttribute("style", "display: block;");
		alink.setAttribute("href", "https://github.com/peterujah");
		alink.setAttribute("style", "color: #000;text-decoration: none;display: block;");
		span.setAttribute("style", "font-weight:700;display: block;padding: 5px;font-size: 15px;background-color: #fff");
		span.textContent = "Created By BlockByte Tech";
		
		alink.appendChild(span);
		row.appendChild(alink);
		map.controls[maps.ControlPosition.BOTTOM_LEFT].push(row);
	},
	
	removeMarker: function() {
		for (var i = 0; i < markerz.length; i++) {
			markerz[i].setMap(null);
		}
		markerz = [];
	},

    doNothing: function(){
		
	},
	
	
	createInfoWindow: function(map, markers, type, infoWindow){
		var storeIcon =  {
				url: settings.icons.pinned,
				scaledSize: new google.maps.Size(40, 40), 
				origin: new google.maps.Point(0,0), 
				anchor: new google.maps.Point(0,0)
		};
		Array.prototype.forEach.call(markers, function(markerElem) {
			var infowincontent = document.createElement('div');
			var strong = document.createElement('strong');
			var br = document.createElement('br');
			var span = document.createElement('span');
			var text = document.createElement('text');
			
			var id = markerElem.getAttribute('id');
			var name = markerElem.getAttribute('name');
			var address = markerElem.getAttribute('address');
			var type = markerElem.getAttribute('type');
			var point = new google.maps.LatLng(
				parseFloat(markerElem.getAttribute('lat')),
				parseFloat(markerElem.getAttribute('lng'))
			);
			
			/*WINDOW*/
			infowincontent.setAttribute("class", "text-center app-map-info-window");
			/*STRONG*/
			strong.textContent = name;
			/*LINK*/
			span.textContent = name;
			span.title   = name;
			span.setAttribute("class", "strong map-span-link");
			span.setAttribute("data-address-id", id);
			/*SET TEXT*/
			text.textContent = address;
			/*SET WINDOW*/
			infowincontent.appendChild(br);
			infowincontent.appendChild(span);
			infowincontent.appendChild(br);
			infowincontent.appendChild(text);
			
			var icon = settings.customLabel[type] || {};
			var marker = new google.maps.Marker({
				map: map,
				position: point,
				icon: storeIcon,
				label:  icon.label
			});
			
			marker.addListener('click', function() {
				infoWindow.setContent(infowincontent);
				infoWindow.open(map, marker);
			});
		});
	}
};

  
  function registerGoogleApi(){
	if (typeof google === "undefined" || typeof google.maps === "undefined") {
		return $.getScript('https://maps.googleapis.com/maps/api/js?key='+settings.apiKey+'&libraries=places&callback=initMap');
	}
	return new $.Deferred().resolve(google.maps);
}
registerGoogleApi().then(function(){
	initGoogleMap();
});
