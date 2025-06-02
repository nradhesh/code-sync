import { useState } from "react";
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

const CrudDemo = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [userId, setUserId] = useState("");
  const [userData, setUserData] = useState({ name: "", roomId: "" });
  const [userResult, setUserResult] = useState(null);

  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomId, setRoomId] = useState("");
  const [roomData, setRoomData] = useState({ name: "", description: "", createdBy: "" });
  const [roomResult, setRoomResult] = useState(null);

  // User CRUD
  const fetchUsers = async () => {
    const res = await axios.get(`${API_BASE}/users`);
    setUsers(res.data.data || []);
  };
  const fetchUser = async () => {
    if (!userId) return;
    const res = await axios.get(`${API_BASE}/users/${userId}`);
    setUserResult(res.data.data);
  };
  const createUser = async () => {
    const res = await axios.post(`${API_BASE}/users`, userData);
    setUserResult(res.data.data);
    fetchUsers();
  };
  const updateUser = async () => {
    if (!userId) return;
    const res = await axios.patch(`${API_BASE}/users/${userId}`, userData);
    setUserResult(res.data.data);
    fetchUsers();
  };
  const deleteUser = async () => {
    if (!userId) return;
    const res = await axios.delete(`${API_BASE}/users/${userId}`);
    setUserResult(res.data.data);
    fetchUsers();
  };

  // Room CRUD
  const fetchRooms = async () => {
    const res = await axios.get(`${API_BASE}/rooms`);
    setRooms(res.data.data || []);
  };
  const fetchRoom = async () => {
    if (!roomId) return;
    const res = await axios.get(`${API_BASE}/rooms/${roomId}`);
    setRoomResult(res.data.data);
  };
  const createRoom = async () => {
    const res = await axios.post(`${API_BASE}/rooms`, roomData);
    setRoomResult(res.data.data);
    fetchRooms();
  };
  const updateRoom = async () => {
    if (!roomId) return;
    const res = await axios.patch(`${API_BASE}/rooms/${roomId}`, roomData);
    setRoomResult(res.data.data);
    fetchRooms();
  };
  const deleteRoom = async () => {
    if (!roomId) return;
    const res = await axios.delete(`${API_BASE}/rooms/${roomId}`);
    setRoomResult(res.data.data);
    fetchRooms();
  };

  return (
    <div className="p-8 font-mono bg-gray-100 min-h-screen space-y-12">
      {/* User Section */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-4">Users CRUD</h2>
        <div className="flex flex-wrap gap-4 mb-4">
          <button onClick={fetchUsers} className="btn">Get All Users</button>
          <input placeholder="User ID" value={userId} onChange={e => setUserId(e.target.value)} className="input" />
          <button onClick={fetchUser} className="btn">Get User</button>
          <button onClick={deleteUser} className="btn bg-red-500 text-white">Delete User</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input placeholder="Name" value={userData.name} onChange={e => setUserData({ ...userData, name: e.target.value })} className="input" />
          <input placeholder="Room ID" value={userData.roomId} onChange={e => setUserData({ ...userData, roomId: e.target.value })} className="input" />
          <div className="flex gap-2">
            <button onClick={createUser} className="btn">Create User</button>
            <button onClick={updateUser} className="btn bg-yellow-500">Update User</button>
          </div>
        </div>
        <ul className="bg-gray-50 p-4 rounded-md">
          {users.map(u => <li key={u._id}>{u.name ?? "(no name)"} ({u._id})</li>)}
        </ul>
        {userResult && <pre className="mt-4 bg-gray-200 p-4 rounded">{JSON.stringify(userResult, null, 2)}</pre>}
      </div>

      {/* Room Section */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-4">Rooms CRUD</h2>
        <div className="flex flex-wrap gap-4 mb-4">
          <button onClick={fetchRooms} className="btn">Get All Rooms</button>
          <input placeholder="Room ID" value={roomId} onChange={e => setRoomId(e.target.value)} className="input" />
          <button onClick={fetchRoom} className="btn">Get Room</button>
          <button onClick={deleteRoom} className="btn bg-red-500 text-white">Delete Room</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input placeholder="Name" value={roomData.name} onChange={e => setRoomData({ ...roomData, name: e.target.value })} className="input" />
          <input placeholder="Description" value={roomData.description} onChange={e => setRoomData({ ...roomData, description: e.target.value })} className="input" />
          <input placeholder="Created By (User ID)" value={roomData.createdBy} onChange={e => setRoomData({ ...roomData, createdBy: e.target.value })} className="input" />
        </div>
        <div className="flex gap-2">
          <button onClick={createRoom} className="btn">Create Room</button>
          <button onClick={updateRoom} className="btn bg-yellow-500">Update Room</button>
        </div>
        <ul className="bg-gray-50 p-4 rounded-md mt-4">
          {rooms.map(r => <li key={r.roomId}>{r.name ?? "(no name)"} ({r.roomId})</li>)}
        </ul>
        {roomResult && <pre className="mt-4 bg-gray-200 p-4 rounded">{JSON.stringify(roomResult, null, 2)}</pre>}
      </div>
    </div>
  );
};

export default CrudDemo;
