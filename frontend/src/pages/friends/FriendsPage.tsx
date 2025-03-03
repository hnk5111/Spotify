import { useEffect } from 'react';
import { useFriendsStore } from '@/stores/useFriendsStore';
import FriendsMap from '@/components/FriendsMap';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUser } from '@clerk/clerk-react';

const FriendsPage = () => {
  useUser();
  const {
    friends,
    friendLocations,
    isLoading,
    error,
    getFriends,
    getFriendLocations,
    acceptFriendRequest,
    rejectFriendRequest,
    updateLocation,
  } = useFriendsStore();

  useEffect(() => {
    getFriends();
    getFriendLocations();

    // Set up location tracking
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          updateLocation(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('Error tracking location:', error);
        },
        { enableHighAccuracy: true }
      );

      // Update friend locations periodically
      const intervalId = setInterval(() => {
        getFriendLocations();
      }, 30000); // Update every 30 seconds

      return () => {
        navigator.geolocation.clearWatch(watchId);
        clearInterval(intervalId);
      };
    }
  }, []);

  const pendingRequests = friends.filter((friend) => friend.status === 'pending');
  const acceptedFriends = friends.filter((friend) => friend.status === 'accepted');

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Friends Map */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Friends Map</CardTitle>
            </CardHeader>
            <CardContent>
              <FriendsMap friendLocations={friendLocations} />
            </CardContent>
          </Card>
        </div>

        {/* Friends List */}
        <div className="space-y-6">
          {/* Friend Requests */}
          {pendingRequests.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Friend Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px]">
                  <div className="space-y-4">
                    {pendingRequests.map((request) => (
                      <div
                        key={request._id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={request.userId} />
                            <AvatarFallback>
                              {request.userId.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{request.userId}</p>
                            <p className="text-sm text-muted-foreground">
                              Wants to be friends
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => acceptFriendRequest(request._id)}
                          >
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => rejectFriendRequest(request._id)}
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          {/* Friends List */}
          <Card>
            <CardHeader>
              <CardTitle>Friends</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-4">
                  {acceptedFriends.map((friend) => {
                    const location = friendLocations.find(
                      (loc) => loc.user._id === friend.friendId
                    );

                    return (
                      <div
                        key={friend._id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={friend.friendId} />
                            <AvatarFallback>
                              {friend.friendId.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{friend.friendId}</p>
                            {location && (
                              <p className="text-sm text-muted-foreground">
                                Last seen:{' '}
                                {new Date(
                                  location.location.lastUpdated
                                ).toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {acceptedFriends.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">
                      No friends yet
                    </p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FriendsPage; 