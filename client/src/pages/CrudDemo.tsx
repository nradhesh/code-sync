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

interface State {
  items: Array<User | Room>;
  itemId: string;
  itemData: { name: string; roomId?: string; description?: string; createdBy?: string };
  itemResult: any;
  itemError: string | null;
}

const CrudDemo = () => {
  const [userState, setUserState] = useState<State>({
    items: [],
    itemId: "",
    itemData: { name: "", roomId: "" },
    itemResult: null,
    itemError: null,
  });

  const [roomState, setRoomState] = useState<State>({
    items: [],
    itemId: "",
    itemData: { name: "", description: "", createdBy: "" },
    itemResult: null,
    itemError: null,
  });

  const fetchItems = async (setState: React.Dispatch<React.SetStateAction<State>>, endpoint: string) => {
    try {
      const res = await axios.get(`${API_BASE}/${endpoint}`);
      setState(prev => ({
        ...prev,
        items: res.data.data || [],
        itemError: null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        itemError: "Error fetching items",
      }));
      console.error(`Error fetching ${endpoint}:`, error);
    }
  };

  const fetchItem = async (setState: React.Dispatch<React.SetStateAction<State>>, endpoint: string, id: string) => {
    if (!id) return;

    try {
      const res = await axios.get(`${API_BASE}/${endpoint}/${id}`);
      setState(prev => ({
        ...prev,
        itemResult: res.data.data,
        itemError: null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        itemError: "Error fetching item",
      }));
      console.error(`Error fetching ${endpoint} ${id}:`, error);
    }
  };

  const createItem = async (setState: React.Dispatch<React.SetStateAction<State>>, endpoint: string, data: any) => {
    try {
      const res = await axios.post(`${API_BASE}/${endpoint}`, data);
      setState(prev => ({
        ...prev,
        itemResult: res.data.data,
        itemError: null,
      }));
      await fetchItems(setState, endpoint);
    } catch (error) {
      setState(prev => ({
        ...prev,
        itemError: "Error creating item",
      }));
      console.error(`Error creating ${endpoint}:`, error);
    }
  };

  const updateItem = async (setState: React.Dispatch<React.SetStateAction<State>>, endpoint: string, id: string, data: any) => {
    if (!id) return;

    try {
      const res = await axios.patch(`${API_BASE}/${endpoint}/${id}`, data);
      setState(prev => ({
        ...prev,
        itemResult: res.data.data,
        itemError: null,
      }));
      await fetchItems(setState, endpoint);
    } catch (error) {
      setState(prev => ({
        ...prev,
        itemError: "Error updating item",
      }));
      console.error(`Error updating ${endpoint} ${id}:`, error);
    }
  };

  const deleteItem = async (setState: React.Dispatch<React.SetStateAction<State>>, endpoint: string, id: string) => {
    if (!id) return;

    try {
      const res = await axios.delete(`${API_BASE}/${endpoint}/${id}`);
      setState(prev => ({
        ...prev,
        itemResult: res.data.data,
        itemError: null,
      }));
      await fetchItems(setState, endpoint);
    } catch (error) {
      setState(prev => ({
        ...prev,
        itemError: "Error deleting item",
      }));
      console.error(`Error deleting ${endpoint} ${id}:`, error);
    }
  };

  useEffect(() => {
    fetchItems(setUserState, "users");
    fetchItems(setRoomState, "rooms");
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="w-full max-w-6xl px-4 py-8">
        {/* User Section */}
        <div className="bg-white rounded-lg shadow-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">User Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
              <input
                type="text"
                value={userState.itemId}
                onChange={(e) => setUserState(prev => ({ ...prev, itemId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter User ID"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => fetchItem(setUserState, "users", userState.itemId)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Get User
              </button>
              <button
                onClick={() => deleteItem(setUserState, "users", userState.itemId)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete User
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={userState.itemData.name}
                onChange={(e) => setUserState(prev => ({ ...prev, itemData: { ...prev.itemData, name: e.target.value }}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Room ID</label>
              <input
                type="text"
                value={userState.itemData.roomId}
                onChange={(e) => setUserState(prev => ({ ...prev, itemData: { ...prev.itemData, roomId: e.target.value }}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter Room ID"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => createItem(setUserState, "users", userState.itemData)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Create User
            </button>
            <button
              onClick={() => updateItem(setUserState, "users", userState.itemId, userState.itemData)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Update User
            </button>
            <button
              onClick={() => fetchItems(setUserState, "users")}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Get All Users
            </button>
          </div>

          {userState.itemError && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
              {userState.itemError}
            </div>
          )}

          {userState.itemResult && (
            <div className="mt-6 p-4 bg-gray-50 rounded-md border border-gray-200">
              <h3 className="text-lg font-semibold mb-2">User Details</h3>
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                {JSON.stringify(userState.itemResult, null, 2)}
              </pre>
            </div>
          )}

          {userState.items.length > 0 && (
            <div className="mt-6 p-4 bg-gray-50 rounded-md border border-gray-200">
              <h3 className="text-lg font-semibold mb-2">All Users</h3>
              <ul className="space-y-2">
                {userState.items.map((item: User | Room) => {
                  if ('_id' in item) {
                    return (
                      <li key={item._id} className="text-gray-700">
                        {item.name ?? "(no name)"} ({item._id})
                      </li>
                    );
                  }
                  return null;
                })}
              </ul>
            </div>
          )}
        </div>

        {/* Room Section */}
        <div className="bg-white rounded-lg shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Room Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Room ID</label>
              <input
                type="text"
                value={roomState.itemId}
                onChange={(e) => setRoomState(prev => ({ ...prev, itemId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter Room ID"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => fetchItem(setRoomState, "rooms", roomState.itemId)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Get Room
              </button>
              <button
                onClick={() => deleteItem(setRoomState, "rooms", roomState.itemId)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete Room
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Room Name</label>
              <input
                type="text"
                value={roomState.itemData.name}
                onChange={(e) => setRoomState(prev => ({ ...prev, itemData: { ...prev.itemData, name: e.target.value }}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter Room Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                value={roomState.itemData.description}
                onChange={(e) => setRoomState(prev => ({ ...prev, itemData: { ...prev.itemData, description: e.target.value }}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter Description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Created By</label>
              <input
                type="text"
                value={roomState.itemData.createdBy}
                onChange={(e) => setRoomState(prev => ({ ...prev, itemData: { ...prev.itemData, createdBy: e.target.value }}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter Creator ID"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => createItem(setRoomState, "rooms", roomState.itemData)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Create Room
            </button>
            <button
              onClick={() => updateItem(setRoomState, "rooms", roomState.itemId, roomState.itemData)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Update Room
            </button>
            <button
              onClick={() => fetchItems(setRoomState, "rooms")}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Get All Rooms
            </button>
          </div>

          {roomState.itemError && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
              {roomState.itemError}
            </div>
          )}

          {roomState.itemResult && (
            <div className="mt-6 p-4 bg-gray-50 rounded-md border border-gray-200">
              <h3 className="text-lg font-semibold mb-2">Room Details</h3>
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                {JSON.stringify(roomState.itemResult, null, 2)}
              </pre>
            </div>
          )}

          {roomState.items.length > 0 && (
            <div className="mt-6 p-4 bg-gray-50 rounded-md border border-gray-200">
              <h3 className="text-lg font-semibold mb-2">All Rooms</h3>
              <ul className="space-y-2">
                {roomState.items.map((item: User | Room) => {
                  if ('roomId' in item) {
                    return (
                      <li key={item.roomId} className="text-gray-700">
                        {item.name ?? "(no name)"} ({item.roomId})
                      </li>
                    );
                  }
                  return null;
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CrudDemo;
