import { useState } from 'react';
import { RideEntry, RideEntryType } from '../model';

interface RidesListProps {
  rides: RideEntry[];
  setRides: (rides: RideEntry[]) => void;
}

export const RidesList = ({ rides, setRides }: RidesListProps) => {
  const [errorMessage, setErrorMessage] = useState('');

  const handleDelete = async (ride: RideEntry) => {
    await fetch(import.meta.env.VITE_BACKEND_URL + `/user/ride/${ride.id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ entryType: ride.rideEntryType }),
    })
      .then((response) => {
        if (response.ok) {
          setRides(rides.filter((r) => r.id !== ride.id));
          return;
        }
        throw new Error('Failed to delete ride');
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  const rideItem = (ride: RideEntry) => {
    let rideValueMetric =
      ride.rideEntryType === RideEntryType.ROUTE
        ? 'km'
        : ride.rideEntryType === RideEntryType.DURATION
          ? 'minutes'
          : 'l/100km';

    return (
      <li
        key={ride.id}
        className="flex items-center justify-between p-2 border-t"
      >
        <div>
          <p>{new Date(ride.date).toLocaleDateString()}</p>
          <span>
            {ride.value / 100} {rideValueMetric}{' '}
            {ride.typeName === null || ride.typeName === ''
              ? ''
              : `- ${ride.typeName}`}
          </span>
        </div>
        <button
          className="bg-black text-white py-2 px-4 rounded font-bold"
          onClick={() => handleDelete(ride)}
        >
          Delete
        </button>
      </li>
    );
  };

  return (
    <div className="py-4">
      {errorMessage && (
        <p className="text-red-500 mb-4 text-center">{errorMessage}</p>
      )}

      <ul>{rides.map((ride) => rideItem(ride))}</ul>
    </div>
  );
};
