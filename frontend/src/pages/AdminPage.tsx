import { useEffect, useState } from 'react';
import { Ad, User } from '../model';
import { AddUserModal } from '../components/AddUserModal';
import { dowloadFile } from '../lib/file';
import { FileInputModal } from '../components/FileInputModal';

export const AdminPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  );
  const [newUserAdUrl, setNewUserAdUrl] = useState<string>('');
  const [openAddUserModal, setOpenAddUserModal] = useState(false);
  const [openFileInputModal, setOpenFileInputModal] = useState(false);

  const fetchUsers = async () => {
    await fetch(import.meta.env.VITE_BACKEND_URL + '/user', {
      credentials: 'include',
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to fetch users');
        }
      })
      .then((users) => {
        setUsers(users);
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  useEffect(() => {
    async function fetchUsersOnLoad() {
      await fetchUsers();
    }
    fetchUsersOnLoad();
  }, []);

  const handleDeleteUser = async (userId: string) => {
    await fetch(import.meta.env.VITE_BACKEND_URL + `/admin/user/${userId}`, {
      method: 'DELETE',
      credentials: 'include',
    })
      .then((response) => {
        if (response.ok) {
          fetchUsers();
        } else {
          throw new Error('Failed to delete user');
        }
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  const handleExportUsers = async () => {
    await fetch(import.meta.env.VITE_BACKEND_URL + '/admin/user/export', {
      credentials: 'include',
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Failed to export users');
      })
      .then((users) => {
        dowloadFile('users.csv', users.csv);
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  const handleImportUsers = async (csv: string) => {
    await fetch(import.meta.env.VITE_BACKEND_URL + '/admin/user/import', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ csv }),
    })
      .then((response) => {
        if (response.ok) {
          fetchUsers();
        } else {
          throw new Error('Failed to import users');
        }
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  const handleSaveAd = () => {
    // Add logic for saving ad
    console.log('Saving ad:', newUserAdUrl);
  };

  return (
    <div className="container mx-auto mt-8">
      <AddUserModal
        open={openAddUserModal}
        onClose={() => {
          setOpenAddUserModal(false);
          fetchUsers();
        }}
      />
      <FileInputModal
        open={openFileInputModal}
        onRead={handleImportUsers}
        onClose={() => setOpenFileInputModal(false)}
        label="Import Users"
      />

      <h1 className="text-2xl font-bold mb-4">Admin Page</h1>
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

      <div className="border p-4 rounded mb-4">
        <h2 className="text-lg font-bold mb-2">Ad Section</h2>
        <div className="flex mb-4">
          <input
            type="text"
            placeholder="Enter Ad URL"
            value={newUserAdUrl}
            onChange={(e) => setNewUserAdUrl(e.target.value)}
            className="border rounded px-2 py-1 mr-2 w-full"
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-12 rounded"
            onClick={handleSaveAd}
          >
            Save
          </button>
        </div>
      </div>

      <div className="flex pb-4 gap-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setOpenAddUserModal(true)}
        >
          Add New User
        </button>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleExportUsers}
        >
          Export Users
        </button>
        <button
          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setOpenFileInputModal(true)}
        >
          Import Users
        </button>
      </div>

      <div className="mb-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="border p-4 mb-4 flex justify-between items-center"
          >
            <div>
              <p className="font-bold">Name: {user.name}</p>
              <p>Email: {user.email}</p>
            </div>
            <button
              className="bg-black text-white font-bold py-2 px-4 rounded"
              onClick={() => handleDeleteUser(user.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
