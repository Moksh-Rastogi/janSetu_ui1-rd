'use client'

import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { MarkerData } from './map-marker'

interface LeafletMapProps {
  markers: MarkerData[]
  selectedMarkerId: string | null
  onMarkerClick: (markerId: string) => void
  selectedCity: string
  targetLocation?: [number, number] | null
}

// City coordinates and their regions
const CITY_DATA: Record<string, { center: [number, number]; zoom: number; regions: { name: string; coords: [number, number] }[] }> = {
  delhi: {
    center: [28.6139, 77.209],
    zoom: 11,
    regions: [
      { name: 'North Delhi', coords: [28.7041, 77.1025] },
      { name: 'South Delhi', coords: [28.5245, 77.2066] },
      { name: 'East Delhi', coords: [28.6280, 77.2950] },
      { name: 'West Delhi', coords: [28.6517, 77.0581] },
      { name: 'Central Delhi', coords: [28.6448, 77.2167] },
      { name: 'New Delhi', coords: [28.6139, 77.2090] },
      { name: 'Dwarka', coords: [28.5921, 77.0460] },
      { name: 'Rohini', coords: [28.7495, 77.0565] },
    ],
  },
  mumbai: {
    center: [19.076, 72.8777],
    zoom: 11,
    regions: [
      { name: 'South Mumbai', coords: [18.9322, 72.8264] },
      { name: 'Central Mumbai', coords: [19.0176, 72.8562] },
      { name: 'Western Suburbs', coords: [19.1136, 72.8697] },
      { name: 'Eastern Suburbs', coords: [19.0596, 72.9052] },
      { name: 'Navi Mumbai', coords: [19.0330, 73.0297] },
      { name: 'Thane', coords: [19.2183, 72.9781] },
    ],
  },
  bangalore: {
    center: [12.9716, 77.5946],
    zoom: 11,
    regions: [
      { name: 'Central Bangalore', coords: [12.9716, 77.5946] },
      { name: 'North Bangalore', coords: [13.0358, 77.5970] },
      { name: 'South Bangalore', coords: [12.8988, 77.5764] },
      { name: 'East Bangalore', coords: [12.9698, 77.6499] },
      { name: 'Whitefield', coords: [12.9698, 77.7500] },
      { name: 'Electronic City', coords: [12.8399, 77.6770] },
    ],
  },
  chennai: {
    center: [13.0827, 80.2707],
    zoom: 11,
    regions: [
      { name: 'Central Chennai', coords: [13.0827, 80.2707] },
      { name: 'North Chennai', coords: [13.1478, 80.2582] },
      { name: 'South Chennai', coords: [12.9815, 80.2180] },
      { name: 'West Chennai', coords: [13.0569, 80.1829] },
      { name: 'Velachery', coords: [12.9815, 80.2180] },
      { name: 'OMR', coords: [12.9165, 80.2270] },
    ],
  },
  kolkata: {
    center: [22.5726, 88.3639],
    zoom: 11,
    regions: [
      { name: 'Central Kolkata', coords: [22.5726, 88.3639] },
      { name: 'North Kolkata', coords: [22.6243, 88.3629] },
      { name: 'South Kolkata', coords: [22.5024, 88.3474] },
      { name: 'Salt Lake', coords: [22.5958, 88.4114] },
      { name: 'Howrah', coords: [22.5958, 88.2636] },
      { name: 'New Town', coords: [22.5958, 88.4614] },
    ],
  },
  noida: {
    center: [28.5355, 77.391],
    zoom: 12,
    regions: [
      { name: 'Sector 18', coords: [28.5706, 77.3219] },
      { name: 'Sector 62', coords: [28.6273, 77.3649] },
      { name: 'Sector 15', coords: [28.5858, 77.3101] },
      { name: 'Sector 44', coords: [28.5494, 77.3370] },
      { name: 'Sector 76', coords: [28.5698, 77.3919] },
      { name: 'Greater Noida', coords: [28.4744, 77.5040] },
      { name: 'Noida Extension', coords: [28.5852, 77.4292] },
      { name: 'Sector 137', coords: [28.5120, 77.3926] },
    ],
  },
}

const categoryColors: Record<string, string> = {
  health: '#ef4444',
  food: '#f97316',
  disaster: '#eab308',
  education: '#3b82f6',
}

export function LeafletMap({ markers, selectedMarkerId, onMarkerClick, selectedCity, targetLocation }: LeafletMapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const markersLayerRef = useRef<L.LayerGroup | null>(null)
  const regionMarkersRef = useRef<L.LayerGroup | null>(null)
  const [isMapReady, setIsMapReady] = useState(false)

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    const cityData = CITY_DATA[selectedCity] || CITY_DATA.delhi

    mapRef.current = L.map(mapContainerRef.current, {
      center: cityData.center,
      zoom: cityData.zoom,
      zoomControl: false,
    })

    // Add dark-themed tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(mapRef.current)

    // Add zoom control to bottom right
    L.control.zoom({ position: 'bottomleft' }).addTo(mapRef.current)

    // Initialize marker layers
    markersLayerRef.current = L.layerGroup().addTo(mapRef.current)
    regionMarkersRef.current = L.layerGroup().addTo(mapRef.current)

    setIsMapReady(true)

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  // Update map when city changes
  useEffect(() => {
    if (!mapRef.current || !isMapReady) return

    const cityData = CITY_DATA[selectedCity] || CITY_DATA.delhi
    mapRef.current.setView(cityData.center, cityData.zoom)

    // Clear and add region markers
    if (regionMarkersRef.current) {
      regionMarkersRef.current.clearLayers()
      
      cityData.regions.forEach((region) => {
        const regionMarker = L.circleMarker(region.coords, {
          radius: 8,
          fillColor: '#ffffff',
          color: '#ffffff',
          weight: 1,
          opacity: 0.3,
          fillOpacity: 0.1,
        })

        regionMarker.bindTooltip(region.name, {
          permanent: false,
          direction: 'top',
          className: 'region-tooltip',
        })

        regionMarkersRef.current?.addLayer(regionMarker)
      })
    }
  }, [selectedCity, isMapReady])

  // Handle target location from search
  useEffect(() => {
    if (!mapRef.current || !isMapReady || !targetLocation) return
    mapRef.current.setView(targetLocation, 14, { animate: true })
  }, [targetLocation, isMapReady])

  // Update markers
  useEffect(() => {
    if (!mapRef.current || !markersLayerRef.current || !isMapReady) return

    const cityData = CITY_DATA[selectedCity] || CITY_DATA.delhi
    markersLayerRef.current.clearLayers()

    markers.forEach((marker, index) => {
      // Distribute markers across city regions
      const regionIndex = index % cityData.regions.length
      const region = cityData.regions[regionIndex]
      
      // Add some randomness to marker position within region
      const lat = region.coords[0] + (Math.random() - 0.5) * 0.03
      const lng = region.coords[1] + (Math.random() - 0.5) * 0.03

      const color = categoryColors[marker.category] || '#888888'
      const isSelected = marker.id === selectedMarkerId
      const isCritical = marker.severity === 'critical'

      // Create custom marker
      const markerElement = L.divIcon({
        className: 'custom-marker',
        html: `
          <div class="marker-container ${isSelected ? 'selected' : ''} ${isCritical ? 'critical' : ''}">
            <div class="marker-dot" style="background-color: ${color}; box-shadow: 0 0 ${isCritical ? '15px' : '8px'} ${color};">
              ${isCritical ? '<div class="pulse-ring" style="border-color: ' + color + '"></div>' : ''}
            </div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      })

      const leafletMarker = L.marker([lat, lng], { icon: markerElement })
      
      leafletMarker.bindTooltip(
        `<div class="marker-tooltip">
          <strong>${marker.title}</strong><br/>
          <span style="color: ${color};">${marker.severity.toUpperCase()}</span> - ${marker.peopleAffected.toLocaleString()} affected
        </div>`,
        { direction: 'top', offset: [0, -10] }
      )

      leafletMarker.on('click', () => onMarkerClick(marker.id))
      
      markersLayerRef.current?.addLayer(leafletMarker)
    })
  }, [markers, selectedMarkerId, selectedCity, onMarkerClick, isMapReady])

  return (
    <>
      <style jsx global>{`
        .custom-marker {
          background: transparent;
          border: none;
        }
        .marker-container {
          position: relative;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .marker-container.selected .marker-dot {
          transform: scale(1.5);
        }
        .marker-dot {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          transition: transform 0.2s ease;
          position: relative;
        }
        .pulse-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 2px solid;
          animation: pulse 2s ease-out infinite;
        }
        @keyframes pulse {
          0% {
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0;
          }
        }
        .marker-tooltip {
          font-size: 12px;
          line-height: 1.4;
        }
        .leaflet-tooltip {
          background: rgba(0, 0, 0, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: white;
          padding: 8px 12px;
        }
        .leaflet-tooltip-top:before {
          border-top-color: rgba(0, 0, 0, 0.85);
        }
        .region-tooltip {
          background: rgba(0, 0, 0, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 11px;
        }
      `}</style>
      <div ref={mapContainerRef} className="absolute inset-0 z-0" />
    </>
  )
}
