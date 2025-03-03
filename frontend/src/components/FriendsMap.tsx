import { useEffect, useState, useRef } from 'react';
import { UserLocation } from '@/types';
import { Card } from './ui/card';
import { useUser } from '@clerk/clerk-react';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

interface FriendsMapProps {
  friendLocations: UserLocation[];
}

const FriendsMap = ({ friendLocations }: FriendsMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  useUser();
  const [] = useState<UserLocation | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number }>({ lat: 20.5937, lng: 78.9629 }); // Default to India's center

  useEffect(() => {
    // Load Mapple SDK
    const script = document.createElement('script');
    script.src = 'https://apis.mapmyindia.com/advancedmaps/v1/${process.env.NEXT_PUBLIC_MAPPLE_REST_KEY}/map_load?v=1.5';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (mapRef.current && (window as any).MapmyIndia) {
        // Initialize map
        const map = new (window as any).MapmyIndia.Map(mapRef.current, {
          center: [userLocation.lat, userLocation.lng],
          zoomControl: true,
          hybrid: true,
          search: false,
          location: true,
        });

        // Get user's current location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const currentLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
              setUserLocation(currentLocation);
              map.setCenter([currentLocation.lat, currentLocation.lng]);

              // Add user marker
              new (window as any).MapmyIndia.Marker({
                map: map,
                position: [currentLocation.lat, currentLocation.lng],
                icon: '/user-marker.png',
                popupHtml: '<div>Your location</div>'
              });

              // Add friend markers
              friendLocations.forEach(friend => {
                new (window as any).MapmyIndia.Marker({
                  map: map,
                  position: [friend.location.latitude, friend.location.longitude],
                  popupHtml: `
                    <div class="flex items-center gap-2 p-2">
                      <div class="w-8 h-8 rounded-full overflow-hidden">
                        <img src="${friend.user.image || ''}" alt="${friend.user.name}" 
                             class="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p class="font-medium">${friend.user.name}</p>
                        <p class="text-xs text-gray-500">
                          Last seen: ${new Date(friend.location.lastUpdated).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  `
                });
              });
            },
            (error) => {
              console.error('Error getting location:', error);
            }
          );
        }
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [friendLocations]);

  return (
    <Card className="p-4">
      <div ref={mapRef} style={mapContainerStyle} className="rounded-lg overflow-hidden" />
    </Card>
  );
};

export default FriendsMap; 