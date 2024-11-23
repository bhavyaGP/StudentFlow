if (!token) {
            return res.status(401).json({ error: 'Unauthorized: No token provided' });
        }