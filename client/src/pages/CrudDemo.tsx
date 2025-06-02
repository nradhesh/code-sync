// [same imports & interfaces at the top]

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
          <h2 className="text-2xl font-bold text-black mb-6">User Management</h2>
          {/* inputs and buttons omitted for brevity (same as original) */}

          {userState.itemError && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
              {userState.itemError}
            </div>
          )}

          {userState.itemResult && (
            <div className="mt-6 p-4 bg-gray-50 rounded-md border border-gray-200">
              <h3 className="text-lg font-semibold mb-2 text-black">User Details</h3>
              <pre className="text-sm text-black whitespace-pre-wrap">
                {JSON.stringify(userState.itemResult, null, 2)}
              </pre>
            </div>
          )}

          {userState.items.length > 0 && (
            <div className="mt-6 p-4 bg-gray-50 rounded-md border border-gray-200">
              <h3 className="text-lg font-semibold mb-2 text-black">All Users</h3>
              <ul className="space-y-2">
                {userState.items.map((item: User | Room) => {
                  if ("_id" in item) {
                    return (
                      <li key={item._id} className="text-black bg-gray-100 p-2 rounded-md">
                        <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(item, null, 2)}</pre>
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
          <h2 className="text-2xl font-bold text-black mb-6">Room Management</h2>
          {/* inputs and buttons omitted for brevity (same as original) */}

          {roomState.itemError && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
              {roomState.itemError}
            </div>
          )}

          {roomState.itemResult && (
            <div className="mt-6 p-4 bg-gray-50 rounded-md border border-gray-200">
              <h3 className="text-lg font-semibold mb-2 text-black">Room Details</h3>
              <pre className="text-sm text-black whitespace-pre-wrap">
                {JSON.stringify(roomState.itemResult, null, 2)}
              </pre>
            </div>
          )}

          {roomState.items.length > 0 && (
            <div className="mt-6 p-4 bg-gray-50 rounded-md border border-gray-200">
              <h3 className="text-lg font-semibold mb-2 text-black">All Rooms</h3>
              <ul className="space-y-2">
                {roomState.items.map((item: User | Room) => {
                  if ("roomId" in item) {
                    return (
                      <li key={item.roomId} className="text-black bg-gray-100 p-2 rounded-md">
                        <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(item, null, 2)}</pre>
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
