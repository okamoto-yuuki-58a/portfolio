import { Controller } from "@hotwired/stimulus"
import Sortable from "sortablejs"

export default class extends Controller {
  static targets = ["map", "searchBox", "spotsList", "saveButton"]

  connect() {
    this.initMap()
    this.initSearchBox()
    this.initSortable()
    this.spots = []
    this.markers = new Map()
    this.loadSpots()
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
      id: `new_${Date.now()}`,
      name: place.name,
      latitude: place.geometry.location.lat(),
      longitude: place.geometry.location.lng()
    }

    this.spots.push(spot)
    this.updateSpotsList()
    this.addMarker(spot)
  }

  addMarker(spot) {
    const marker = new google.maps.Marker({
      position: { lat: spot.latitude, lng: spot.longitude },
      map: this.map,
      title: spot.name
    })
    this.markers.set(spot.id, marker)
  }

  removeSpot(event) {
    const spotId = event.currentTarget.dataset.spotId
    const spotIndex = this.spots.findIndex(spot => spot.id.toString() === spotId)
    if (spotIndex !== -1) {
      const spot = this.spots[spotIndex]
      if (spot.id.toString().startsWith('new_')) {
        // 新しく追加されたスポットの場合は完全に削除
        this.spots.splice(spotIndex, 1)
      } else {
        // 既存のスポットの場合は_destroyフラグを立てる
        spot._destroy = true
      }
      this.updateSpotsList()
      this.removeMarker(spotId)
    }
  }

  removeMarker(spotId) {
    const marker = this.markers.get(spotId)
    if (marker) {
      marker.setMap(null)
      this.markers.delete(spotId)
    }
  }

  updateSpotsList() {
    this.spotsListTarget.innerHTML = this.spots
      .filter(spot => !spot._destroy)
      .map(spot => `
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

  async savePlan() {
    const planId = this.element.dataset.planId
    const csrfToken = document.querySelector('meta[name="csrf-token"]').content

    try {
      const response = await fetch(`/plans/${planId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          plan: {
            spot_lists_attributes: this.spots.map(spot => ({
              id: spot.id.toString().startsWith('new_') ? null : spot.id,
              name: spot.name,
              latitude: spot.latitude,
              longitude: spot.longitude,
              _destroy: spot._destroy ? true : undefined
            }))
          }
        })
      })

      if (response.ok) {
        const result = await response.json()
        alert(result.message)
        await this.loadSpots()
      } else {
        const error = await response.json()
        alert(`エラー: ${error.message}`)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('保存中にエラーが発生しました')
    }
  }

  async loadSpots() {
    const planId = this.element.dataset.planId
    try {
      const response = await fetch(`/plans/${planId}/spot_lists`)
      if (response.ok) {
        const spots = await response.json()
        this.spots = spots
        this.updateSpotsList()
        this.markers.forEach(marker => marker.setMap(null))
        this.markers.clear()
        spots.forEach(spot => this.addMarker(spot))
      }
    } catch (error) {
      console.error('Error loading spots:', error)
    }
  }
}