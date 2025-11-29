import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';

const generateToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
        expiresIn: '30d',
    });
};

export const registerUser = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }

    const user = await User.create({
        name,
        email,
        password,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id.toString()),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

export const authUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await (user as any).matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id.toString()),
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req: Request, res: Response) => {
    const { token } = req.body;

    try {
        // Verify the token using Google's API
        // Note: For Expo AuthSession, we might receive an access token instead of an ID token depending on the flow.
        // However, standard practice is to verify the ID token.
        // If using accessToken, we fetch user info from Google UserInfo endpoint.

        // Assuming we get an accessToken from frontend for simplicity with Expo
        const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`);
        const data = await response.json();

        if (!data.email) {
            res.status(400).json({ message: 'Invalid Google Token' });
            return;
        }

        const { email, name, sub: googleId } = data;

        let user = await User.findOne({ email });

        if (user) {
            // If user exists but doesn't have googleId, update it
            if (!user.get('googleId')) {
                user.set('googleId', googleId);
                await user.save();
            }
        } else {
            // Create new user
            user = await User.create({
                name,
                email,
                googleId,
                password: '', // No password for Google users
            });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id.toString()),
        });

    } catch (error) {
        console.error('Google Login Error:', error);
        res.status(400).json({ message: 'Google Login Failed' });
    }
};

export const syncUser = async (req: Request, res: Response) => {
    const { name, email, googleId } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
            // Update googleId if missing
            if (googleId && !user.get('googleId')) {
                user.set('googleId', googleId);
                await user.save();
            }
        } else {
            // Create new user
            user = await User.create({
                name,
                email,
                googleId,
                password: '', // Optional for Clerk users
            });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id.toString()),
        });
    } catch (error) {
        console.error('Sync User Error:', error);
        res.status(500).json({ message: 'Failed to sync user' });
    }
};
