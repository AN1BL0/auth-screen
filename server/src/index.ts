import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import { randomUUID } from 'node:crypto'
import { JSONFilePreset } from 'lowdb/node'

interface User {
    id: string
    name: string
    email: string
    passwordHash: string
}

interface Session {
    token: string
    userId: string
}

interface Database {
    users: User[]
    sessions: Session[]
}

interface RegisterBody {
    name?: string
    email?: string
    password?: string
}

interface LoginBody {
    email?: string
    password?: string
}

const PORT = 4000

const db = await JSONFilePreset<Database>('db.json', {
    users: [],
    sessions: [],
})

const app = express()

app.use(
    cors({
        origin: 'http://localhost:5173',
    }),
)

app.use(express.json())

function getPublicUser(user: User) {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
    }
}

function getTokenFromRequest(req: express.Request) {
    const authHeader = req.headers.authorization

    if (!authHeader) {
        return null
    }

    const [type, token] = authHeader.split(' ')

    if (type !== 'Bearer' || !token) {
        return null
    }

    return token
}

app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
    })
})

app.post('/auth/register', async (req, res) => {
    const { name, email, password } = req.body as RegisterBody

    if (!name?.trim() || !email?.trim() || !password?.trim()) {
        return res.status(400).json({
            message: 'Name, email and password are required',
        })
    }

    if (password.length < 6) {
        return res.status(400).json({
            message: 'Password must be at least 6 characters',
        })
    }

    const normalizedEmail = email.trim().toLowerCase()

    const existingUser = db.data.users.find((user) => {
        return user.email === normalizedEmail
    })

    if (existingUser) {
        return res.status(409).json({
            message: 'User with this email already exists',
        })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const user: User = {
        id: randomUUID(),
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
    }

    const token = randomUUID()

    db.data.users.push(user)
    db.data.sessions.push({
        token,
        userId: user.id,
    })

    await db.write()

    return res.status(201).json({
        user: getPublicUser(user),
        token,
    })
})

app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body as LoginBody

    if (!email?.trim() || !password?.trim()) {
        return res.status(400).json({
            message: 'Email and password are required',
        })
    }

    const normalizedEmail = email.trim().toLowerCase()

    const user = db.data.users.find((user) => {
        return user.email === normalizedEmail
    })

    if (!user) {
        return res.status(401).json({
            message: 'Invalid email or password',
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)

    if (!isPasswordValid) {
        return res.status(401).json({
            message: 'Invalid email or password',
        })
    }

    const token = randomUUID()

    db.data.sessions.push({
        token,
        userId: user.id,
    })

    await db.write()

    return res.json({
        user: getPublicUser(user),
        token,
    })
})

app.get('/auth/me', (req, res) => {
    const token = getTokenFromRequest(req)

    if (!token) {
        return res.status(401).json({
            message: 'Unauthorized',
        })
    }

    const session = db.data.sessions.find((session) => {
        return session.token === token
    })

    if (!session) {
        return res.status(401).json({
            message: 'Unauthorized',
        })
    }

    const user = db.data.users.find((user) => {
        return user.id === session.userId
    })

    if (!user) {
        return res.status(401).json({
            message: 'Unauthorized',
        })
    }

    return res.json({
        user: getPublicUser(user),
    })
})

app.post('/auth/logout', async (req, res) => {
    const token = getTokenFromRequest(req)

    if (token) {
        db.data.sessions = db.data.sessions.filter((session) => {
            return session.token !== token
        })

        await db.write()
    }

    return res.status(204).send()
})

app.listen(PORT, () => {
    console.log(`Auth server is running on http://localhost:${PORT}`)
})