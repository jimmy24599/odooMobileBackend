import axios from 'axios';
import dotenv from 'dotenv';
import { getSettings } from './settingsStore.js';
dotenv.config();

const envUrl = process.env.URL;
const envDbName = process.env.ODOO_DB; 


//export const signInTest = async (req, res) => {
    //const { email, password } = req.body;
    //const odoo = require('@tapni/odoo-xmlrpc');
    //const client = new odoo.Client(url, db);
    //const response = await client.execute('res.users', 'authenticate', [email, password]);
    //if (response.result){
        //return res.json({
            //uid: response.result.uid,
            //name: response.result.name,
            //isAuthenticated: true,
        //});
    //}
    //else {
        //return res.json({
            //uid: null,
            //name: null,
            //isAuthenticated: false,
        //});
    //}
//}


export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const settings = getSettings();
        const baseUrl = settings.baseUrl || envUrl;
        const dbName = settings.db || envDbName;
                
        const response = await axios.post(`${baseUrl}/web/session/authenticate`, {
            jsonrpc: '2.0',
            method: 'call',
            id: 1,
            params: {
                login: email,
                password: password,
                db: dbName,
            },
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        if (response.data.error) {
            console.error('JSON-RPC Error:', response.data.error);
            return res.status(400).json({ 
                message: response.data.error.message || 'Authentication failed',
                error: response.data.error 
            });
        }
        
        if (response.data.result) {
            console.log('Login successful:', response.data.result);
            
            // Extract session cookie from Odoo response
            const cookies = response.headers['set-cookie'];
            let sessionId = null;
            
            if (cookies) {
                const sessionCookie = cookies.find(cookie => cookie.startsWith('session_id='));
                if (sessionCookie) {
                    sessionId = sessionCookie.split(';')[0].split('=')[1];
                }
            }
            
            return res.json({
                uid: response.data.result.uid,
                name: response.data.result.name,
                sessionId: sessionId,
                isAuthenticated: true,
            });
        }
        
        return res.status(401).json({ 
            message: 'Authentication failed',
            isAuthenticated: false 
        });
        
    } catch (error) {
        console.error('Authentication error:', error.response?.data || error.message);
        res.status(500).json({ 
            message: 'Internal server error',
            error: error.response?.data || error.message 
        });
    }
};


export const getSession = async (req, res) => {
    try {
        const { sessionId } = req.body;
        
        if (!sessionId) {
            return res.status(400).json({ 
                message: 'Session ID is required' 
            });
        }
        
        // Verify session and get user data
        const settings = getSettings();
        const baseUrl = settings.baseUrl || envUrl;
        const response = await axios.post(`${baseUrl}/web/dataset/call_kw`, {
            jsonrpc: '2.0',
            method: 'call',
            id: 1,
            params: {
                model: 'res.users',
                method: 'read',
                args: [[1]], 
                kwargs: {
                    fields: ['id', 'name', 'login', 'email']
                }
            },
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `session_id=${sessionId}`
            },
        });
        
        if (response.data.error) {
            console.error('Session validation error:', response.data.error);
            return res.status(401).json({ 
                message: 'Invalid session',
                error: response.data.error 
            });
        }
        
        if (response.data.result) {
            return res.json({
                isValid: true,
                sessionData: response.data.result
            });
        }
        
        return res.status(401).json({ 
            message: 'Invalid session',
            isValid: false 
        });
        
    } catch (error) {
        console.error('Session validation error:', error.response?.data || error.message);
        res.status(500).json({ 
            message: 'Internal server error',
            error: error.response?.data || error.message 
        });
    }
}