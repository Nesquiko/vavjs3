import { useNavigate } from 'react-router-dom';
import {
  NewRideEntry,
  RideEntry,
  RideEntryType,
  RideType,
  User,
} from '../model';
import { useState } from 'react';
import { ManageRideTypesModal } from '../components/ManageRideTypesModal';
import { RidesList } from '../components/RidesList';
import { dowloadFile } from '../lib/file';
import { FileInputModal } from '../components/FileInputModal';

interface HomePageProps {
  user: User;
  setRideTypes: (rideTypes: RideType[]) => void;
  setRideEntries: (rideEntries: RideEntry[]) => void;
}

export const HomePage = ({
  user,
  setRideTypes,
  setRideEntries,
}: HomePageProps) => {
  const navigation = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [newRideErrorMessage, setNewRideErrorMessage] = useState('');
  const [ridesListErrorMessage, setRidesListErrorMessage] = useState('');
  const [openManageRideTypes, setOpenManageRideTypes] = useState(false);
  const [selectedRideEntryType, setSelectedMetric] = useState<RideEntryType>(
    RideEntryType.ROUTE,
  );
  const [selectedRideType, setSelectedRideType] = useState<RideType | null>(
    null,
  );
  const [rideValue, setRideValue] = useState<number | null>(null);
  const [rideDate, setRideDate] = useState<Date | undefined>(undefined);
  const [openFileInputModal, setOpenFileInputModal] = useState(false);

  const handleLogout = async () => {
    await fetch(import.meta.env.VITE_BACKEND_URL + '/user/logout', {
      method: 'POST',
      credentials: 'include',
    })
      .then((response) => {
        if (response.ok) {
          navigation('/login');
        } else {
          throw new Error('Failed to logout');
        }
      })
      .catch((error) => setErrorMessage(error.message));
  };

  const handleSaveRide = async () => {
    if (rideValue === null) {
      setNewRideErrorMessage('Please enter a value');
      return;
    } else if (selectedRideType === undefined) {
      setNewRideErrorMessage('Please select a ride type');
      return;
    } else if (selectedRideEntryType === undefined) {
      setNewRideErrorMessage('Please select a ride entry type');
      return;
    } else if (rideDate === undefined) {
      setNewRideErrorMessage('Please select a date');
      return;
    }
    setNewRideErrorMessage('');

    const newRideEntry: NewRideEntry = {
      date: rideDate,
      value: Math.round(rideValue * 100),
      typeId: selectedRideType === null ? '' : selectedRideType.id,
      typeName: selectedRideType === null ? '' : selectedRideType.name,
      rideEntryType: selectedRideEntryType,
    };

    await fetch(import.meta.env.VITE_BACKEND_URL + '/user/ride', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newRideEntry),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Failed to save ride');
      })
      .then((savedRide) => setRideEntries([...user.rides, savedRide]))
      .catch((error) => setNewRideErrorMessage(error.message));
  };

  const handleExportRides = async () => {
    await fetch(import.meta.env.VITE_BACKEND_URL + '/user/ride/export', {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Failed to export rides');
      })
      .then((exportedRides) => dowloadFile('rides.csv', exportedRides.csv))
      .catch((error) => setRidesListErrorMessage(error.message));
  };

  const handleImportUsers = async (contents: string) => {
    await fetch(import.meta.env.VITE_BACKEND_URL + '/user/ride/import', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ csv: contents }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Failed to import rides');
      })
      .then((userRides) => setRideEntries(userRides))
      .catch((error) => setRidesListErrorMessage(error.message));
  };

  return (
    <div className="relative p-4">
      <FileInputModal
        open={openFileInputModal}
        setOpen={setOpenFileInputModal}
        onRead={handleImportUsers}
        onClose={() => setOpenFileInputModal(false)}
        label="Import Rides"
      />

      <ManageRideTypesModal
        open={openManageRideTypes}
        onClose={() => setOpenManageRideTypes(false)}
        rideTypes={user.rideTypes}
        setRideTypes={setRideTypes}
      />
      <h1 className="text-black text-3xl">Rides Dashboard</h1>
      {errorMessage && (
        <p className="text-red-500 mb-4 text-center">{errorMessage}</p>
      )}
      <div className="absolute top-0 right-0">
        {user.name === 'admin' && (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 mr-4"
            onClick={() => navigation('/admin')}
          >
            Admin Dashboard
          </button>
        )}
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 mr-4"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      <div className="p-4 m-4 flex flex-col gap-4 border rounded">
        <h2 className="text-xl font-bold">Create New Ride</h2>
        <label>
          Date of Ride
          <input
            type="date"
            className="border rounded w-80 p-2 text-gray-700 leading-tight"
            onChange={(e) => setRideDate(new Date(e.target.value))}
          />
        </label>
        <div className="flex gap-4">
          {Object.values(RideEntryType).map((rideEntryType) => (
            <button
              key={rideEntryType}
              className={`${
                selectedRideEntryType === rideEntryType
                  ? 'bg-blue-500'
                  : 'bg-gray-300 hover:bg-gray-400'
              } text-white w-40 font-bold py-2 px-4 rounded`}
              onClick={() => setSelectedMetric(rideEntryType)}
            >
              {rideEntryType.charAt(0).toUpperCase() + rideEntryType.slice(1)}
            </button>
          ))}
        </div>
        <label className="block font-bold">
          <input
            type="number"
            className="border rounded w-40 p-2 text-gray-700 leading-tight mr-4"
            value={rideValue || ''}
            onChange={(e) => {
              let value = parseFloat(e.target.value);
              if (isNaN(value)) {
                value = 0;
              }
              setRideValue(Math.round(value * 100) / 100);
            }}
          />

          {selectedRideEntryType === RideEntryType.ROUTE
            ? 'km'
            : selectedRideEntryType === RideEntryType.CONSUMPTION
              ? 'l/100km'
              : 'minutes'}
        </label>
        <label>
          Ride Type
          <select
            className="border rounded w-80 py-2 ml-4 leading-tight"
            onChange={(e) => {
              if (e.target.value === '') {
                setSelectedRideType(null);
                return;
              }

              const rideType = user.rideTypes.find(
                (rideType) => rideType.id === e.target.value,
              );
              setSelectedRideType(rideType!);
            }}
          >
            <option value="">None</option>
            {user.rideTypes.map((rideType) => (
              <option key={rideType.id} value={rideType.id}>
                {rideType.name}
              </option>
            ))}
          </select>
        </label>

        <div className="flex gap-4">
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleSaveRide}
          >
            Save Ride
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setOpenManageRideTypes(true)}
          >
            Manage Ride Types
          </button>
          {newRideErrorMessage && (
            <p className="text-red-500 text-center text-2xl my-auto">
              {newRideErrorMessage}
            </p>
          )}
        </div>
      </div>
      <div className="p-4 m-4 gap-4 border rounded">
        <div className="flex justify-end gap-4">
          {ridesListErrorMessage && (
            <p className="text-red-500 mb-4 text-center">
              {ridesListErrorMessage}
            </p>
          )}
          <button
            className="bg-green-500 text-white w-40 font-bold py-2 px-4 rounded"
            onClick={() => navigation('/graphs')}
          >
            Graphs
          </button>
          <button
            className="bg-blue-500 text-white w-40 font-bold py-2 px-4 rounded"
            onClick={handleExportRides}
          >
            Export rides
          </button>
          <button
            className="bg-yellow-500 text-white w-40 font-bold py-2 px-4 rounded"
            onClick={() => setOpenFileInputModal(true)}
          >
            Import rides
          </button>
        </div>

        <RidesList rides={user.rides} setRides={setRideEntries} />
      </div>
    </div>
  );
};
