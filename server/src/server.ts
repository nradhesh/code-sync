import express, { Response, Request } from "express"
import dotenv from "dotenv"
import http from "http"
import cors from "cors"
import { SocketEvent, SocketId } from "./types/socket"
import { USER_CONNECTION_STATUS, User } from "./types/user"
import { Server } from "socket.io"
import path from "path"
import { connectDB } from "./config/db"
import { UserSession } from "./models/UserSession"
import { Types } from 'mongoose'

dotenv.config()

// Connect to MongoDB
connectDB().then(() => {
	console.log('MongoDB connection established successfully');
}).catch((error) => {
	console.error('Failed to connect to MongoDB:', error);
});

const app = express()

app.use(express.json())

app.use(cors())

app.use(express.static(path.join(__dirname, "public"))) // Serve static files

const server = http.createServer(app)
const io = new Server(server, {
	cors: {
		origin: "*",
	},
	maxHttpBufferSize: 1e8,
	pingTimeout: 60000,
})

let userSocketMap: User[] = []

// Function to get all users in a room
async function getUsersInRoom(roomId: string): Promise<User[]> {
	const users = await UserSession.find({ roomId }).lean()
	return users.map(user => ({
		username: user.username,
		roomId: user.roomId,
		status: user.status,
		cursorPosition: user.cursorPosition,
		typing: user.typing,
		currentFile: user.currentFile,
		socketId: user.socketId
	}))
}

// Function to get room id by socket id
async function getRoomId(socketId: SocketId): Promise<string | null> {
	const user = await UserSession.findOne({ socketId }).lean()
	if (!user) {
		console.error("Room ID is undefined for socket ID:", socketId)
		return null
	}
	return user.roomId
}

async function getUserBySocketId(socketId: SocketId): Promise<User | null> {
	const user = await UserSession.findOne({ socketId }).lean()
	if (!user) {
		console.error("User not found for socket ID:", socketId)
		return null
	}
	return {
		username: user.username,
		roomId: user.roomId,
		status: user.status,
		cursorPosition: user.cursorPosition,
		typing: user.typing,
		currentFile: user.currentFile,
		socketId: user.socketId
	}
}

io.on("connection", async (socket) => {
	// Handle user actions
	socket.on(SocketEvent.JOIN_REQUEST, async ({ roomId, username }) => {
		try {
			console.log(`Attempting to join room: ${roomId} with username: ${username}`);
			// Check if username exists in the room
			const existingUser = await UserSession.findOne({ roomId, username })
			if (existingUser) {
				console.log(`Username ${username} already exists in room ${roomId}`);
				io.to(socket.id).emit(SocketEvent.USERNAME_EXISTS)
				return
			}

			const user = {
				username,
				roomId,
				status: USER_CONNECTION_STATUS.ONLINE,
				cursorPosition: 0,
				typing: false,
				socketId: socket.id,
				currentFile: null,
			}

			console.log('Creating new user session:', user);
			// Store user session in MongoDB
			const createdUser = await UserSession.create(user)
			console.log('User session created successfully:', createdUser);

			socket.join(roomId)
			socket.broadcast.to(roomId).emit(SocketEvent.USER_JOINED, { user })
			const users = await getUsersInRoom(roomId)
			console.log(`Current users in room ${roomId}:`, users);
			io.to(socket.id).emit(SocketEvent.JOIN_ACCEPTED, { user, users })
		} catch (error) {
			console.error('Error in JOIN_REQUEST:', error)
			io.to(socket.id).emit('error', { message: 'Failed to join room' })
		}
	})

	socket.on("disconnecting", async () => {
		try {
			console.log(`User disconnecting with socket ID: ${socket.id}`);
			const user = await getUserBySocketId(socket.id)
			if (!user) {
				console.log(`No user found for socket ID: ${socket.id}`);
				return
			}

			console.log('Removing user session:', user);
			const roomId = user.roomId
			socket.broadcast.to(roomId).emit(SocketEvent.USER_DISCONNECTED, { user })
			
			// Remove user session from MongoDB
			const deleteResult = await UserSession.deleteOne({ socketId: socket.id })
			console.log('User session deletion result:', deleteResult);
			
			socket.leave(roomId)
		} catch (error) {
			console.error('Error in disconnecting:', error)
		}
	})

	// Handle file actions
	socket.on(
		SocketEvent.SYNC_FILE_STRUCTURE,
		({ fileStructure, openFiles, activeFile, socketId }) => {
			io.to(socketId).emit(SocketEvent.SYNC_FILE_STRUCTURE, {
				fileStructure,
				openFiles,
				activeFile,
			})
		}
	)

	socket.on(
		SocketEvent.DIRECTORY_CREATED,
		async ({ parentDirId, newDirectory }) => {
			const roomId = await getRoomId(socket.id)
			if (!roomId) return
			socket.broadcast.to(roomId).emit(SocketEvent.DIRECTORY_CREATED, {
				parentDirId,
				newDirectory,
			})
		}
	)

	socket.on(SocketEvent.DIRECTORY_UPDATED, async ({ dirId, children }) => {
		const roomId = await getRoomId(socket.id)
		if (!roomId) return
		socket.broadcast.to(roomId).emit(SocketEvent.DIRECTORY_UPDATED, {
			dirId,
			children,
		})
	})

	socket.on(SocketEvent.DIRECTORY_RENAMED, async ({ dirId, newName }) => {
		const roomId = await getRoomId(socket.id)
		if (!roomId) return
		socket.broadcast.to(roomId).emit(SocketEvent.DIRECTORY_RENAMED, {
			dirId,
			newName,
		})
	})

	socket.on(SocketEvent.DIRECTORY_DELETED, async ({ dirId }) => {
		const roomId = await getRoomId(socket.id)
		if (!roomId) return
		socket.broadcast
			.to(roomId)
			.emit(SocketEvent.DIRECTORY_DELETED, { dirId })
	})

	socket.on(SocketEvent.FILE_CREATED, async ({ parentDirId, newFile }) => {
		const roomId = await getRoomId(socket.id)
		if (!roomId) return
		socket.broadcast
			.to(roomId)
			.emit(SocketEvent.FILE_CREATED, { parentDirId, newFile })
	})

	socket.on(SocketEvent.FILE_UPDATED, async ({ fileId, newContent }) => {
		const roomId = await getRoomId(socket.id)
		if (!roomId) return
		socket.broadcast.to(roomId).emit(SocketEvent.FILE_UPDATED, {
			fileId,
			newContent,
		})
	})

	socket.on(SocketEvent.FILE_RENAMED, async ({ fileId, newName }) => {
		const roomId = await getRoomId(socket.id)
		if (!roomId) return
		socket.broadcast.to(roomId).emit(SocketEvent.FILE_RENAMED, {
			fileId,
			newName,
		})
	})

	socket.on(SocketEvent.FILE_DELETED, async ({ fileId }) => {
		const roomId = await getRoomId(socket.id)
		if (!roomId) return
		socket.broadcast.to(roomId).emit(SocketEvent.FILE_DELETED, { fileId })
	})

	// Handle user status
	socket.on(SocketEvent.USER_OFFLINE, async ({ socketId }) => {
		try {
			await UserSession.updateOne(
				{ socketId },
				{ $set: { status: USER_CONNECTION_STATUS.OFFLINE } }
			)
			const roomId = await getRoomId(socketId)
			if (!roomId) return
			socket.broadcast.to(roomId).emit(SocketEvent.USER_OFFLINE, { socketId })
		} catch (error) {
			console.error('Error in USER_OFFLINE:', error)
		}
	})

	socket.on(SocketEvent.USER_ONLINE, async ({ socketId }) => {
		try {
			await UserSession.updateOne(
				{ socketId },
				{ $set: { status: USER_CONNECTION_STATUS.ONLINE } }
			)
			const roomId = await getRoomId(socketId)
			if (!roomId) return
			socket.broadcast.to(roomId).emit(SocketEvent.USER_ONLINE, { socketId })
		} catch (error) {
			console.error('Error in USER_ONLINE:', error)
		}
	})

	// Handle chat actions
	socket.on(SocketEvent.SEND_MESSAGE, async ({ message }) => {
		const roomId = await getRoomId(socket.id)
		if (!roomId) return
		socket.broadcast
			.to(roomId)
			.emit(SocketEvent.RECEIVE_MESSAGE, { message })
	})

	// Handle cursor position
	socket.on(SocketEvent.TYPING_START, async ({ cursorPosition }) => {
		try {
			await UserSession.updateOne(
				{ socketId: socket.id },
				{ $set: { typing: true, cursorPosition } }
			)
			const user = await getUserBySocketId(socket.id)
			if (!user) return
			const roomId = user.roomId
			socket.broadcast.to(roomId).emit(SocketEvent.TYPING_START, { user })
		} catch (error) {
			console.error('Error in TYPING_START:', error)
		}
	})

	socket.on(SocketEvent.TYPING_PAUSE, async () => {
		try {
			await UserSession.updateOne(
				{ socketId: socket.id },
				{ $set: { typing: false } }
			)
			const user = await getUserBySocketId(socket.id)
			if (!user) return
			const roomId = user.roomId
			socket.broadcast.to(roomId).emit(SocketEvent.TYPING_PAUSE, { user })
		} catch (error) {
			console.error('Error in TYPING_PAUSE:', error)
		}
	})

	socket.on(SocketEvent.REQUEST_DRAWING, async () => {
		const roomId = await getRoomId(socket.id)
		if (!roomId) return
		socket.broadcast
			.to(roomId)
			.emit(SocketEvent.REQUEST_DRAWING, { socketId: socket.id })
	})

	socket.on(SocketEvent.SYNC_DRAWING, ({ drawingData, socketId }) => {
		socket.broadcast
			.to(socketId)
			.emit(SocketEvent.SYNC_DRAWING, { drawingData })
	})

	socket.on(SocketEvent.DRAWING_UPDATE, async ({ snapshot }) => {
		const roomId = await getRoomId(socket.id)
		if (!roomId) return
		socket.broadcast.to(roomId).emit(SocketEvent.DRAWING_UPDATE, {
			snapshot,
		})
	})
})

// Add debugging for environment variables
console.log('Environment variables:', {
	PORT: process.env.PORT,
	NODE_ENV: process.env.NODE_ENV
});

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 10000;
console.log('Using port:', PORT);

app.get("/", (req: Request, res: Response) => {
	// Send the index.html file
	res.sendFile(path.join(__dirname, "..", "public", "index.html"))
})

app.get('/health', (req, res) => {
	res.status(200).json({ status: 'ok' });
});

app.get('/active-users', async (req: Request, res: Response) => {
	try {
		const users = await UserSession.find().lean();
		console.log('Current active users:', users);
		res.json({ users });
	} catch (error) {
		console.error('Error fetching active users:', error);
		res.status(500).json({ error: 'Failed to fetch active users' });
	}
});

// API Routes for User Management
// Get all users
app.get('/api/users', async (req: Request, res: Response) => {
	try {
		const users = await UserSession.find().lean();
		console.log('Fetching all users:', users);
		res.json({ 
			success: true,
			count: users.length,
			data: users 
		});
	} catch (error) {
		console.error('Error fetching users:', error);
		res.status(500).json({ 
			success: false,
			error: 'Failed to fetch users' 
		});
	}
});

// Get user by ID
app.get('/api/users/:id', async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		
		// Validate if the ID is a valid MongoDB ObjectId
		if (!Types.ObjectId.isValid(id)) {
			return res.status(400).json({
				success: false,
				error: 'Invalid user ID format'
			});
		}

		const user = await UserSession.findById(id).lean();
		
		if (!user) {
			return res.status(404).json({
				success: false,
				error: 'User not found'
			});
		}

		console.log('Fetching user by ID:', user);
		res.json({
			success: true,
			data: user
		});
	} catch (error) {
		console.error('Error fetching user:', error);
		res.status(500).json({
			success: false,
			error: 'Failed to fetch user'
		});
	}
});

// Delete user by ID
app.delete('/api/users/:id', async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		// Validate if the ID is a valid MongoDB ObjectId
		if (!Types.ObjectId.isValid(id)) {
			return res.status(400).json({
				success: false,
				error: 'Invalid user ID format'
			});
		}

		const deletedUser = await UserSession.findByIdAndDelete(id).lean();
		
		if (!deletedUser) {
			return res.status(404).json({
				success: false,
				error: 'User not found'
			});
		}

		console.log('Deleted user:', deletedUser);
		res.json({
			success: true,
			message: 'User deleted successfully',
			data: deletedUser
		});
	} catch (error) {
		console.error('Error deleting user:', error);
		res.status(500).json({
			success: false,
			error: 'Failed to delete user'
		});
	}
});

// Update user by ID
app.patch('/api/users/:id', async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const updates = req.body;

		// Validate if the ID is a valid MongoDB ObjectId
		if (!Types.ObjectId.isValid(id)) {
			return res.status(400).json({
				success: false,
				error: 'Invalid user ID format'
			});
		}

		// Remove any fields that shouldn't be updated
		delete updates._id;
		delete updates.socketId; // Prevent socketId from being changed
		delete updates.createdAt;
		delete updates.updatedAt;

		const updatedUser = await UserSession.findByIdAndUpdate(
			id,
			{ $set: updates },
			{ new: true, runValidators: true }
		).lean();

		if (!updatedUser) {
			return res.status(404).json({
				success: false,
				error: 'User not found'
			});
		}

		console.log('Updated user:', updatedUser);
		res.json({
			success: true,
			data: updatedUser
		});
	} catch (error) {
		console.error('Error updating user:', error);
		res.status(500).json({
			success: false,
			error: 'Failed to update user'
		});
	}
});

server.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`)
})
