import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "https://code-sync-production-5d6d.up.railway.app/api";

interface User {
  _id: string;
  name?: string;
  roomId?: string;
  [key: string]: any;
}

interface Room {
  roomId: string;
  name?: string;
  description?: string;
  createdBy?: string;
  [key: string]: any;
}

interface State<T> {
  items: T[];
  itemId: string;
  itemData: Partial<T>;
  itemResult: any;
  itemError: string | null;
}

const CrudDemo = () => {
  const [userState, setUserState] = useState<State<User>>({
    items: [],
    itemId: "",
    itemData: { name: "", roomId: "" },
    itemResult: null,
    itemError: null,
  });

  const [roomState, setRoomState] = useState<State<Room>>({
    items: [],
    itemId: "",
    itemData: { name: "", description: "", createdBy: "" },
    itemResult: null,
    itemError: null,
  });

  const fetchItems = async <T,>(
    setState: React.Dispatch<React.SetStateAction<State<T>>>,
    endpoint: string
  ) => {
    try {
      const res = await axios.get(`${API_BASE}/${endpoint}`);
      setState((prev) => ({
        ...prev,
        items: res.data.data || [],
        itemError: null,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        itemError: `Error fetching ${endpoint}`,
      }));
    }
  };

  const fetchItem = async <T,>(
    setState: React.Dispatch<React.SetStateAction<State<T>>>,
    endpoint: string,
    id: string
  ) => {
    if (!id) return;
    try {
      const res = await axios.get(`${API_BASE}/${endpoint}/${id}`);
      setState((prev) => ({
        ...prev,
        itemResult: res.data.data,
        itemError: null,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        itemError: `Error fetching ${endpoint} item`,
      }));
    }
  };

  const createItem = async <T,>(
    setState: React.Dispatch<React.SetStateAction<State<T>>>,
    endpoint: string,
    data: Partial<T>
  ) => {
    try {
      const res = await axios.post(`${API_BASE}/${endpoint}`, data);
      setState((prev) => ({
        ...prev,
        itemResult: res.data.data,
        itemError: null,
      }));
      await fetchItems(setState, endpoint);
    } catch (error) {
      setState((prev) => ({
        ...prev,
        itemError: `Error creating ${endpoint} item`,
      }));
    }
  };

  const updateItem = async <T,>(
    setState: React.Dispatch<React.SetStateAction<State<T>>>,
    endpoint: string,
    id: string,
    data: Partial<T>
  ) => {
    if (!id) return;
    try {
      const res = await axios.patch(`${API_BASE}/${endpoint}/${id}`, data);
      setState((prev) => ({
        ...prev,
        itemResult: res.data.data,
        itemError: null,
      }));
      await fetchItems(setState, endpoint);
    } catch (error) {
      setState((prev) => ({
        ...prev,
        itemError: `Error updating ${endpoint} item`,
      }));
    }
  };

  const deleteItem = async <T,>(
    setState: React.Dispatch<React.SetStateAction<State<T>>>,
    endpoint: string,
    id: string
  ) => {
    if (!id) return;
    try {
      const res = await axios.delete(`${API_BASE}/${endpoint}/${id}`);
      setState((prev) => ({
        ...prev,
        itemResult: res.data.data,
        itemError: null,
      }));
      await fetchItems(setState, endpoint);
    } catch (error) {
      setState((prev) => ({
        ...prev,
        itemError: `Error deleting ${endpoint} item`,
      }));
    }
  };

  useEffect(() => {
    fetchItems(setUserState, "users");
    fetchItems(setRoomState, "rooms");
  }, []);

  return (
    <div className="p-4 space-y-12">
      {/* === User Section === */}
      <section>
        <h2 className="text-2xl font-bold mb-4">User Management</h2>
        <div className="space-x-2">
          <input
            type="text"
            placeholder="User ID"
            value={userState.itemId}
            onChange={(e) =>
              setUserState((prev) => ({ ...prev, itemId: e.target.value }))
            }
className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
          />
          <button
            onClick={() => fetchItem(setUserState, "users", userState.itemId)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Get
          </button>
          <button
            onClick={() => deleteItem(setUserState, "users", userState.itemId)}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Delete
          </button>
        </div>
        <div className="space-x-2 mt-2">
          <input
            type="text"
            placeholder="Name"
            value={userState.itemData.name || ""}
            onChange={(e) =>
              setUserState((prev) => ({
                ...prev,
                itemData: { ...prev.itemData, name: e.target.value },
              }))
            }
className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
          />
          <input
            type="text"
            placeholder="Room ID"
            value={userState.itemData.roomId || ""}
            onChange={(e) =>
              setUserState((prev) => ({
                ...prev,
                itemData: { ...prev.itemData, roomId: e.target.value },
              }))
            }
className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
          />
        </div>
        <div className="space-x-2 mt-2">
          <button
            onClick={() => createItem(setUserState, "users", userState.itemData)}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Create
          </button>
          <button
            onClick={() =>
              updateItem(setUserState, "users", userState.itemId, userState.itemData)
            }
            className="bg-yellow-500 text-white px-4 py-2 rounded"
          >
            Update
          </button>
          <button
            onClick={() => fetchItems(setUserState, "users")}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Refresh
          </button>
        </div>
        {userState.itemError && <p className="text-red-600">{userState.itemError}</p>}
        {userState.itemResult && (
          <pre className="bg-gray-100 p-2 mt-2">{JSON.stringify(userState.itemResult, null, 2)}</pre>
        )}
        {userState.items.length > 0 && (
          <ul className="mt-2 list-disc pl-5">
            {userState.items.map((u) => (
              <li key={u._id}>
                {u.name} — {u._id}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* === Room Section === */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Room Management</h2>
        <div className="space-x-2">
          <input
            type="text"
            placeholder="Room ID"
            value={roomState.itemId}
            onChange={(e) =>
              setRoomState((prev) => ({ ...prev, itemId: e.target.value }))
            }
className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
          />
          <button
            onClick={() => fetchItem(setRoomState, "rooms", roomState.itemId)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Get
          </button>
          <button
            onClick={() => deleteItem(setRoomState, "rooms", roomState.itemId)}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Delete
          </button>
        </div>
        <div className="space-x-2 mt-2">
          <input
            type="text"
            placeholder="Name"
            value={roomState.itemData.name || ""}
            onChange={(e) =>
              setRoomState((prev) => ({
                ...prev,
                itemData: { ...prev.itemData, name: e.target.value },
              }))
            }
className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
          />
          <input
            type="text"
            placeholder="Description"
            value={roomState.itemData.description || ""}
            onChange={(e) =>
              setRoomState((prev) => ({
                ...prev,
                itemData: { ...prev.itemData, description: e.target.value },
              }))
            }
className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
          />
          <input
            type="text"
            placeholder="Created By"
            value={roomState.itemData.createdBy || ""}
            onChange={(e) =>
              setRoomState((prev) => ({
                ...prev,
                itemData: { ...prev.itemData, createdBy: e.target.value },
              }))
            }
className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
          />
        </div>
        <div className="space-x-2 mt-2">
          <button
            onClick={() => createItem(setRoomState, "rooms", roomState.itemData)}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Create
          </button>
          <button
            onClick={() =>
              updateItem(setRoomState, "rooms", roomState.itemId, roomState.itemData)
            }
            className="bg-yellow-500 text-white px-4 py-2 rounded"
          >
            Update
          </button>
          <button
            onClick={() => fetchItems(setRoomState, "rooms")}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Refresh
          </button>
        </div>
        {roomState.itemError && <p className="text-red-600">{roomState.itemError}</p>}
        {roomState.itemResult && (
          <pre className="bg-gray-100 p-2 mt-2">{JSON.stringify(roomState.itemResult, null, 2)}</pre>
        )}
        {roomState.items.length > 0 && (
          <ul className="mt-2 list-disc pl-5">
            {roomState.items.map((r) => (
              <li key={r.roomId}>
                {r.name} — {r.roomId}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default CrudDemo;