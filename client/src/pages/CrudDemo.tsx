import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "https://code-sync-production-5d6d.up.railway.app/api";

interface User {
  _id: string;
  name?: string;
  roomId?: string;
}

interface Room {
  roomId: string;
  name?: string;
  description?: string;
  createdBy?: string;
}

const CrudDemo = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [userId, setUserId] = useState("");
  const [userData, setUserData] = useState({ name: "", roomId: "" });
  const [userResult, setUserResult] = useState<any>(null);

  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomId, setRoomId] = useState("");
  const [roomData, setRoomData] = useState({ name: "", description: "", createdBy: "" });
  const [roomResult, setRoomResult] = useState<any>(null);

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

  useEffect(() => {
    fetchUsers();
    fetchRooms();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 space-y-10 font-mono">
      {/* Users Section */}
      <div className="bg-gray-800 p-6 rounded-xl">
        <h2 className="text-2xl font-bold mb-4">Users CRUD</h2>
        <div className="flex gap-2 flex-wrap mb-4">
          <button onClick={fetchUsers} className="btn">Get All Users</button>
          <input className="input" placeholder="User ID" value={userId} onChange={e => setUserId(e.target.value)} />
          <button onClick={fetchUser} className="btn">Get User</button>
          <button onClick={deleteUser} className="btn bg-red-600">Delete User</button>
        </div>
        <div className="grid md:grid-cols-3 gap-2 mb-4">
          <input className="input" placeholder="Name" value={userData.name} onChange={e => setUserData({ ...userData, name: e.target.value })} />
          <input className="input" placeholder="Room ID" value={userData.roomId} onChange={e => setUserData({ ...userData, roomId: e.target.value })} />
          <div className="flex gap-2">
            <button onClick={createUser} className="btn">Create</button>
            <button onClick={updateUser} className="btn">Update</button>
          </div>
        </div>
        <ul className="text-sm bg-gray-700 p-4 rounded">
          {users.map(u => <li key={u._id}>{u.name ?? "(no name)"} ({u._id})</li>)}
        </ul>
        {userResult && <pre className="bg-gray-800 mt-4 p-4 rounded text-sm">{JSON.stringify(userResult, null, 2)}</pre>}
      </div>

      {/* Rooms Section */}
      <div className="bg-gray-800 p-6 rounded-xl">
        <h2 className="text-2xl font-bold mb-4">Rooms CRUD</h2>
        <div className="flex gap-2 flex-wrap mb-4">
          <button onClick={fetchRooms} className="btn">Get All Rooms</button>
          <input className="input" placeholder="Room ID" value={roomId} onChange={e => setRoomId(e.target.value)} />
          <button onClick={fetchRoom} className="btn">Get Room</button>
          <button onClick={deleteRoom} className="btn bg-red-600">Delete Room</button>
        </div>
        <div className="grid md:grid-cols-3 gap-2 mb-4">
          <input className="input" placeholder="Name" value={roomData.name} onChange={e => setRoomData({ ...roomData, name: e.target.value })} />
          <input className="input" placeholder="Description" value={roomData.description} onChange={e => setRoomData({ ...roomData, description: e.target.value })} />
          <input className="input" placeholder="Created By" value={roomData.createdBy} onChange={e => setRoomData({ ...roomData, createdBy: e.target.value })} />
          <div className="flex gap-2">
            <button onClick={createRoom} className="btn">Create</button>
            <button onClick={updateRoom} className="btn">Update</button>
          </div>
        </div>
        <ul className="text-sm bg-gray-700 p-4 rounded">
          {rooms.map(r => <li key={r.roomId}>{r.name ?? "(no name)"} ({r.roomId})</li>)}
        </ul>
        {roomResult && <pre className="bg-gray-800 mt-4 p-4 rounded text-sm">{JSON.stringify(roomResult, null, 2)}</pre>}
      </div>
    </div>
  );
};

export default CrudDemo;
