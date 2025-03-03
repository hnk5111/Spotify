import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { MapPin,  Navigation } from 'lucide-react';

const MapPage = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [map, setMap] = useState<any>(null);
  const [userMarker, setUserMarker] = useState<any>(null);
  const [locationDetails, setLocationDetails] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{lat: number; lng: number} | null>(null);

  const getAddressFromCoordinates = async (lat: number, lng: number, apiKey: string) => {
    try {
      const response = await fetch(
        `https://apis.mapmyindia.com/advancedmaps/v1/${apiKey}/rev_geocode?lat=${lat}&lng=${lng}`
      );
      const data = await response.json();
      if (data.results && data.results[0]) {
        const result = data.results[0];
        return `${result.street || ''} ${result.locality || ''}, ${result.subDistrict || ''}, ${result.district || ''}, ${result.state || ''}`;
      }
      return null;
    } catch (error) {
      console.error('Error fetching address:', error);
      return null;
    }
  };

  const zoomToLocation = (mapInstance: any, location: {lat: number; lng: number}) => {
    if (!mapInstance || !location) return;
    try {
      console.log('Zooming to location:', location);
      
      // Remove existing marker if any
      if (userMarker) {
        userMarker.remove();
      }

      // Update map center
      mapInstance.setCenter([location.lat, location.lng]);
      
      // Set zoom level after a short delay
      setTimeout(() => {
        mapInstance.setZoom(16);
        
        // Create popup content
        const popupContent = `
          <div class="p-3">
            <p class="font-medium mb-1">Your Location</p>
            <p class="text-sm text-muted-foreground">Lat: ${location.lat.toFixed(6)}</p>
            <p class="text-sm text-muted-foreground">Lng: ${location.lng.toFixed(6)}</p>
            ${locationDetails ? `<p class="text-sm mt-2">${locationDetails}</p>` : ''}
          </div>
        `;

        // Create new marker
        const marker = new (window as any).MapmyIndia.marker({
          map: mapInstance,
          position: {
            lat: location.lat,
            lng: location.lng
          },
          draggable: false,
          popup: popupContent
        });

        setUserMarker(marker);
        marker.openPopup();
        toast.success('Zoomed to location');
      }, 100);
    } catch (err) {
      console.error('Error zooming to location:', err);
      toast.error('Failed to zoom to location');
    }
  };


  const updateUserLocation = async (mapInstance: any, _shouldZoom: boolean = true) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          console.log('Got user location:', position.coords);
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          
          setCurrentLocation(location);
          
          if (mapInstance) {
            try {
              // Get address details
              const apiKey = import.meta.env.VITE_MAPPLE_REST_KEY;
              const address = await getAddressFromCoordinates(location.lat, location.lng, apiKey);
              setLocationDetails(address);

              // Create popup content
              const popupContent = `
                <div class="p-3">
                  <p class="font-medium mb-1">Your Location</p>
                  <p class="text-sm text-muted-foreground">Lat: ${location.lat.toFixed(6)}</p>
                  <p class="text-sm text-muted-foreground">Lng: ${location.lng.toFixed(6)}</p>
                  ${address ? `<p class="text-sm mt-2">${address}</p>` : ''}
                </div>
              `;

              // Remove existing marker if any
              if (userMarker) {
                userMarker.remove();
              }

              // Create and add marker
              const marker = new (window as any).MapmyIndia.marker({
                map: mapInstance,
                position: {
                  lat: location.lat,
                  lng: location.lng
                },
                draggable: false,
                popup: popupContent
              });

              setUserMarker(marker);
              marker.openPopup();
              toast.success('Location updated');
            } catch (err) {
              console.error('Error updating map:', err);
              toast.error('Error updating location');
            }
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('Could not get your location. Please enable location services.');
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser');
    }
  };

  const handleLocationUpdate = () => {
    if (!map) {
      toast.error('Map not initialized');
      return;
    }
    updateUserLocation(map, false);
  };

  const handleZoomToLocation = () => {
    if (!map || !currentLocation) {
      toast.error('Location not available');
      return;
    }
    console.log('Attempting to zoom to:', currentLocation);
    zoomToLocation(map, currentLocation);
  };

  useEffect(() => {
    // Check if API key exists
    const apiKey = import.meta.env.VITE_MAPPLE_REST_KEY;
    if (!apiKey) {
      setError('Mapple API key is missing. Please add VITE_MAPPLE_REST_KEY to your .env file');
      toast.error('Mapple API key is missing');
      setIsLoading(false);
      return;
    }

    console.log('Loading Mapple SDK...');
    
    // Load Mapple SDK
    const script = document.createElement('script');
    script.src = `https://apis.mapmyindia.com/advancedmaps/v1/${apiKey}/map_load?v=1.5`;
    script.async = true;
    
    script.onerror = () => {
      setError('Failed to load Mapple SDK');
      toast.error('Failed to load map service');
      setIsLoading(false);
      console.error('Failed to load Mapple SDK');
    };

    let mapInstance: any = null;

    script.onload = () => {
      console.log('Mapple SDK loaded');
      
      if (!mapRef.current) {
        setError('Map container not found');
        setIsLoading(false);
        return;
      }

      // Wait for MapmyIndia to be fully loaded
      setTimeout(() => {
        try {
          if (!(window as any).MapmyIndia) {
            throw new Error('MapmyIndia SDK not found');
          }

          console.log('Initializing map...');

          // Make sure the container is ready
          const container = mapRef.current;
          if (!container) {
            throw new Error('Map container not found');
          }

          // Set container ID
          const containerId = 'map-container';
          container.id = containerId;
          
          // Initialize map with center at India
          mapInstance = new (window as any).MapmyIndia.Map(containerId, {
            center: [20.5937, 78.9629],
            zoom: 5,
            zoomControl: true,
            hybrid: false,
            location: false,
            search: false
          });

          // Store map instance
          setMap(mapInstance);

          console.log('Map initialized successfully');
          setIsLoading(false);

          // Get initial user location
          updateUserLocation(mapInstance);
        } catch (err) {
          console.error('Error initializing map:', err);
          setError('Failed to initialize map. Please check your API key and try again.');
          toast.error('Failed to initialize map');
          setIsLoading(false);
        }
      }, 1000); // Give the SDK time to fully initialize
    };

    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      // Cleanup map instance
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, []);

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold text-red-500 mb-2">Map Error</h2>
          <p className="text-muted-foreground">{error}</p>
          <p className="text-sm mt-4">Please check the console for more details</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 h-[calc(100vh-2rem)]">
      <Card className="w-full h-full overflow-hidden relative">
        {isLoading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
            <p className="text-muted-foreground">Loading map...</p>
          </div>
        )}
        <div 
          ref={mapRef} 
          style={{ width: '100%', height: '100%' }}
          className="rounded-lg relative z-0"
        />
        
        {/* Control buttons */}
        <div className="absolute top-4 right-4 flex gap-2 p-2 bg-background/90 backdrop-blur-sm rounded-lg shadow-lg" style={{ zIndex: 9999 }}>
          <Button
            onClick={handleLocationUpdate}
            variant="outline"
            className="flex items-center gap-2 relative"
            title="Update Location"
          >
            <MapPin className="h-4 w-4" />
            <span>Update Location</span>
          </Button>
          <Button
            onClick={handleZoomToLocation}
            variant="outline"
            className="flex items-center gap-2 relative"
            disabled={!currentLocation}
            title="Zoom to Location"
          >
            <Navigation className="h-4 w-4" />
            <span>Go to Location</span>
          </Button>
        </div>

        {/* Location details panel */}
        {locationDetails && (
          <div className="absolute bottom-4 left-4 right-4 bg-background/90 backdrop-blur-sm p-3 rounded-lg shadow-lg max-w-2xl mx-auto" style={{ zIndex: 9999 }}>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <p className="text-sm font-medium">Current Location:</p>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{locationDetails}</p>
            {currentLocation && (
              <p className="text-xs text-muted-foreground mt-1">
                Coordinates: {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
              </p>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default MapPage; 