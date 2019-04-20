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

##### onChangeUrlApi: 
Allow you to specify the url where the api will download xml data when a new location is being typed
##### onLoadUrlApi:
Allow you to specify the url where the map api will download xml data when the page is loaded.
##### searchElementId:
Allow you to specify the search input element id, default id is 'serchLocation'
##### mapElementId:
Allow you to specify the map canvas element id, default id is 'map'
##### icons.ripple:
Allow you to specify animation image to show when typed location
##### icons.pinned:
Allow you to specify pinned adresses

