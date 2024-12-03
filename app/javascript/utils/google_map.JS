import { Loader } from "@googlemaps/js-api-loader"

const loader = new Loader({
  apiKey: process.env.GOOGLE_MAPS_API_KEY,
  version: "weekly",
  libraries: ["places"]
});

export const loadGoogleMaps = () => {
  return loader.load();
};

export const createMap = (elementId, options) => {
  return new google.maps.Map(document.getElementById(elementId), options);
};

export const createSearchBox = (inputId, map) => {
  const input = document.getElementById(inputId);
  const searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  return searchBox;
};

export const createMarker = (place, map) => {
  if (!place.geometry || !place.geometry.location) return;

  return new google.maps.Marker({
    map,
    title: place.name,
    position: place.geometry.location,
  });
};