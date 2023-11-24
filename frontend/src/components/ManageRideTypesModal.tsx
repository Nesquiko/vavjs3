import { useState } from 'react';
import { RideType } from '../model';
import { Modal } from './Modal';

interface ManageRideTypesModalProps {
  open: boolean;
  onClose: () => void;
  rideTypes: RideType[];
  setRideTypes: (rideTypes: RideType[]) => void;
}

export const ManageRideTypesModal = ({
  open,
  onClose,
  rideTypes,
  setRideTypes,
}: ManageRideTypesModalProps) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [newRideType, setNewRideType] = useState({
    name: '',
    description: '',
  });

  const handleCreateRideType = async () => {
    const rt: RideType = {
      id: '',
      name: newRideType.name,
      description: newRideType.description,
      userId: '',
    };

    await fetch(import.meta.env.VITE_BACKEND_URL + '/user/rideType', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rt),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to create ride type');
        }
      })
      .then((rideType) => {
        const newRideTypes = [...rideTypes, rideType];
        setRideTypes(newRideTypes);
        setNewRideType({ name: '', description: '' });
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  const handleDeleteRideType = async (id: string) => {
    await fetch(import.meta.env.VITE_BACKEND_URL + `/user/rideType/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
      .then((response) => {
        if (response.ok) {
          const newRideTypes = rideTypes.filter((rt) => rt.id !== id);
          setRideTypes(newRideTypes);
        } else {
          setErrorMessage('Failed to delete ride type');
        }
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="w-[60vw] p-4">
        <h2 className="text-2xl font-bold">Create New RideType</h2>
        <form className="p-4 flex flex-col gap-4">
          <label className="block text-sm font-bold mb-2">
            Name
            <input
              type="text"
              className="border rounded w-full p-2 leading-tight"
              value={newRideType.name}
              onChange={(e) =>
                setNewRideType({ ...newRideType, name: e.target.value })
              }
            />
          </label>
          <label className="block text-sm font-bold">
            Description
            <input
              type="text"
              className="border rounded w-full p-2 leading-tight"
              value={newRideType.description}
              onChange={(e) =>
                setNewRideType({
                  ...newRideType,
                  description: e.target.value,
                })
              }
            />
          </label>
          <button
            type="button"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleCreateRideType}
          >
            Create
          </button>
        </form>
        {errorMessage && (
          <p className="text-red-500 mb-4 text-center">{errorMessage}</p>
        )}

        <h2 className="text-2xl font-bold">Existing RideTypes</h2>
        <ul>
          {rideTypes.map((rideType) => (
            <li key={rideType.id} className="flex justify-between">
              <span className="font-bold text-lg">
                {rideType.name}{' '}
                <span className="text-sm text-gray-600">
                  - {rideType.description}
                </span>
              </span>
              <button
                className="text-black font-bold rounded"
                onClick={() => handleDeleteRideType(rideType.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
};
