import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const url = process.env.URL;
const dbName = process.env.ODOO_DB || 'egy'; 


export const getModels = async (req, res) => {
    try {
        const { sessionId } = req.body;
        
        if (!sessionId) {
            return res.status(400).json({ 
                message: 'Session ID is required' 
            });
        }
        
        const response = await axios.post(`${url}/web/dataset/call_kw`, {
            jsonrpc: '2.0',
            params: {
                model: 'ir.model',
                method: 'search_read',
                args: [],
                kwargs: {
                    fields: ['name', 'model', ],
                }
            }
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `session_id=${sessionId}`
            },
        });
        
        if (response.data.error) {
            console.error('JSON-RPC Error:', response.data.error);
            return res.status(400).json({ 
                message: response.data.error.message || 'Get products failed',
                error: response.data.error 
            });
        }
        
        if (response.data.result) {
            console.log(response.data.result);
            return res.json({
                success: true,
                products: response.data.result
            });
        }
        
        return res.status(500).json({ 
            message: 'Failed to fetch products',
            success: false 
        });
        
    } catch (error) {
        console.error('Get Products error:', error.response?.data || error.message);
        res.status(500).json({ 
            message: 'Internal server error',
            error: error.response?.data || error.message 
        });
    }
};