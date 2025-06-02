import React, { useState } from "react";
import axios from "axios";

const API_BASE = "https://code-sync-production-5d6d.up.railway.app/api"; // Change if your server runs elsewhere

// Type definitions for User and Room
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
  // User state
  const [users, setUsers] = useState<User[]>([]);
  const [userId, setUserId] = useState("");
  const [userData, setUserData] = useState({ name: "", roomId: "" });
  const [userResult, setUserResult] = useState(null);

  // Room state
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
  };
  const updateUser = async () => {
    if (!userId) return;
    const res = await axios.patch(`${API_BASE}/users/${userId}`, userData);
    setUserResult(res.data.data);
  };
  const deleteUser = async () => {
    if (!userId) return;
    const res = await axios.delete(`${API_BASE}/users/${userId}`);
    setUserResult(res.data.data);
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
  };
  const updateRoom = async () => {
    if (!roomId) return;
    const res = await axios.patch(`${API_BASE}/rooms/${roomId}`, roomData);
    setRoomResult(res.data.data);
  };
  const deleteRoom = async () => {
    if (!roomId) return;
    const res = await axios.delete(`${API_BASE}/rooms/${roomId}`);
    setRoomResult(res.data.data);
  };

  return (
    <div style={{ padding: 24, fontFamily: "monospace" }}>
      <h2>Users CRUD</h2>
      <button onClick={fetchUsers}>Get All Users</button>
      <ul>{users.map((u: User) => <li key={u._id}>{u.name ?? "(no name)"} ({u._id})</li>)}</ul>
      <input placeholder="User ID" value={userId} onChange={e => setUserId(e.target.value)} />
      <button onClick={fetchUser}>Get User</button>
      <button onClick={deleteUser}>Delete User</button>
      <br />
      <input placeholder="Name" value={userData.name} onChange={e => setUserData({ ...userData, name: e.target.value })} />
      <input placeholder="Room ID" value={userData.roomId} onChange={e => setUserData({ ...userData, roomId: e.target.value })} />
      <button onClick={createUser}>Create User</button>
      <button onClick={updateUser}>Update User</button>
      <pre>{userResult && JSON.stringify(userResult, null, 2)}</pre>
      <hr />
      <h2>Rooms CRUD</h2>
      <button onClick={fetchRooms}>Get All Rooms</button>
      <ul>{rooms.map((r: Room) => <li key={r.roomId}>{r.name ?? "(no name)"} ({r.roomId})</li>)}</ul>
      <input placeholder="Room ID" value={roomId} onChange={e => setRoomId(e.target.value)} />
      <button onClick={fetchRoom}>Get Room</button>
      <button onClick={deleteRoom}>Delete Room</button>
      <br />
      <input placeholder="Name" value={roomData.name} onChange={e => setRoomData({ ...roomData, name: e.target.value })} />
      <input placeholder="Description" value={roomData.description} onChange={e => setRoomData({ ...roomData, description: e.target.value })} />
      <input placeholder="Created By (User ID)" value={roomData.createdBy} onChange={e => setRoomData({ ...roomData, createdBy: e.target.value })} />
      <button onClick={createRoom}>Create Room</button>
      <button onClick={updateRoom}>Update Room</button>
      <pre>{roomResult && JSON.stringify(roomResult, null, 2)}</pre>
    </div>
  );
};

export default CrudDemo;
