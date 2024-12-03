import { Controller } from "@hotwired/stimulus"
import Sortable from "sortablejs"

export default class extends Controller {
  static targets = ["map", "searchBox", "spotsList"]

  connect() {
    this.initMap()
    this.initSearchBox()
    this.initSortable()
    this.spots = []
  }

  initMap() {
    const mapOptions = {
      center: { lat: 35.6812362, lng: 139.7671248 },
      zoom: 15
    }
    this.map = new google.maps.Map(this.mapTarget, mapOptions)
  }

  initSearchBox() {
    this.searchBox = new google.maps.places.SearchBox(this.searchBoxTarget)
    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(this.searchBoxTarget)

    this.searchBox.addListener("places_changed", () => {
      const places = this.searchBox.getPlaces()
      if (places.length === 0) return

      const bounds = new google.maps.LatLngBounds()
      places.forEach(place => {
        if (place.geometry && place.geometry.location) {
          bounds.extend(place.geometry.location)
        }
      })
      this.map.fitBounds(bounds)
    })
  }

  initSortable() {
    new Sortable(this.spotsListTarget, {
      animation: 150,
      onEnd: (event) => {
        const spot = this.spots.splice(event.oldIndex, 1)[0]
        this.spots.splice(event.newIndex, 0, spot)
        this.updateSpotsList()
      }
    })
  }

  addSpot() {
    const places = this.searchBox.getPlaces()
    if (places.length === 0) return

    const place = places[0]
    const spot = {
      id: Date.now().toString(),
      name: place.name,
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng()
    }

    this.spots.push(spot)
    this.updateSpotsList()
    this.addMarker(spot)
  }

  addMarker(spot) {
    new google.maps.Marker({
      position: { lat: spot.lat, lng: spot.lng },
      map: this.map,
      title: spot.name
    })
  }

  removeSpot(event) {
    const spotId = event.currentTarget.dataset.spotId
    this.spots = this.spots.filter(spot => spot.id !== spotId)
    this.updateSpotsList()
  }

  updateSpotsList() {
    this.spotsListTarget.innerHTML = this.spots.map(spot => `
      <div class="p-3 bg-gray-100 rounded-lg flex justify-between items-center">
        <span>${spot.name}</span>
        <button data-action="click->plan-edit#removeSpot" data-spot-id="${spot.id}" class="text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    `).join('')
  }
}