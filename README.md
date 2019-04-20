# Google-Javascript-API-Map-XML-Download
Download location coordinates from XML for multiple addresses 


# setting map options
	const settings = {
		"apiKey": "javascript-map-api-key",
		onChangeUrlApi: "_api/change.xml?geolocate=true&",
		onLoadUrlApi: "_api/load.xml?",
		searchElementId: 'serchLocation',
		mapElementId: 'map',
		current: {
			center: { lat:  -33.8688,  lng:151.2195},
			zoom: 16, 
			country: "my", /*[]*/
			componentRestrictions: {'country': 'us'},
			countryRestrict: {'country': 'us'}
		},
		customLabel: {
			restaurant: {label: 'R'},
			bar: {label: 'B'}
		},
		customize: {
			mapTypeControl: true,
			panControl: true,
			zoomControl: true,
			streetViewControl: true,
			clickableIcons: true,
			fullscreenControl: true,
			placeSearchInMapBox: false
		},
		icons: {
		  ripple: "image/animation-ripple.svg",
		  pinned:  "image/store-home-theme.svg",
		}
	};

# Instruction on map setting additional options

In other to set a custom api url parameters you can use "https://example.com/api.php?foo=bar&bob=alic&", make sure you add extra `&` when you have parameter?s to the url. Without any url parameter set the link in this way "https://example.com/api.php?"

##### onChangeUrlApi: 
Allow you to specify the url where the api will download xml data when a new location is being typed.
Every request to server will send a parameters `["change=true", "city=foo", "state=foo", "country=foo"]`
##### onLoadUrlApi:
Allow you to specify the url where the map api will download xml data when the page is loaded.
Every request to server will send a parameters `["ready=true", "city=foo", "state=foo", "country=foo"]`
##### searchElementId:
Allow you to specify the search input element id, default id is 'serchLocation'
##### mapElementId:
Allow you to specify the map canvas element id, default id is 'map'
##### icons.ripple:
Allow you to specify animation image to show when typed location
##### icons.pinned:
Allow you to specify pinned adresses

#### Required Libery

jQuery
