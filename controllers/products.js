import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const url = process.env.URL;
const dbName = process.env.ODOO_DB || 'egy'; 


export const getProducts = async (req, res) => {
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
                model: 'product.product',
                method: 'search_read',
                args: [],
                kwargs: {}
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


// --- Helper function to reduce repetition (Optional but recommended) ---
const odooSearchRead = async (model, sessionId) => {
    const response = await axios.post(`${url}/web/dataset/call_kw`, {
        jsonrpc: '2.0',
        params: {
            model: model,
            method: 'search_read',
            args: [],
            kwargs: {} // Omitting 'fields' returns a default, rich set of fields
        }
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Cookie': `session_id=${sessionId}`
        },
    });

    if (response.data.error) {
        throw response.data.error;
    }
    
    return response.data.result;
};


// 1. Controller for Stock Warehouses
export const getWarehouses = async (req, res) => {
    try {
        const { sessionId } = req.body;
        if (!sessionId) {
            return res.status(400).json({ message: 'Session ID is required' });
        }

        const warehouses = await odooSearchRead('stock.warehouse', sessionId);
        
        return res.json({
            success: true,
            warehouses: warehouses
        });

    } catch (error) {
        console.error('Get Warehouses Error:', error);
        res.status(500).json({ 
            message: 'Internal server error',
            error: error.data?.message || error.message || 'Failed to fetch warehouses'
        });
    }
};

// 2. Controller for Stock Quants (On-Hand Inventory)
export const getQuants = async (req, res) => {
    try {
        const { sessionId } = req.body;
        if (!sessionId) {
            return res.status(400).json({ message: 'Session ID is required' });
        }

        const quants = await odooSearchRead('stock.quant', sessionId);

        return res.json({
            success: true,
            quants: quants
        });

    } catch (error) {
        console.error('Get Quants Error:', error);
        res.status(500).json({ 
            message: 'Internal server error',
            error: error.data?.message || error.message || 'Failed to fetch quants'
        });
    }
};

// 3. Controller for Stock Pickings (Transfers/Operations)
export const getPickings = async (req, res) => {
    try {
        const { sessionId } = req.body;
        if (!sessionId) {
            return res.status(400).json({ message: 'Session ID is required' });
        }

        const pickings = await odooSearchRead('stock.picking', sessionId);

        return res.json({
            success: true,
            pickings: pickings
        });
        
    } catch (error) {
        console.error('Get Pickings Error:', error);
        res.status(500).json({ 
            message: 'Internal server error',
            error: error.data?.message || error.message || 'Failed to fetch pickings'
        });
    }
};


// 4. Controller for Stock Moves (The "what" of a transfer)
export const getStockMoves = async (req, res) => {
    try {
        const { sessionId } = req.body;
        if (!sessionId) {
            return res.status(400).json({ message: 'Session ID is required' });
        }

        const moves = await odooSearchRead('stock.move', sessionId);

        return res.json({
            success: true,
            moves: moves
        });

    } catch (error) {
        console.error('Get Stock Moves Error:', error);
        res.status(500).json({ 
            message: 'Internal server error',
            error: error.data?.message || error.message || 'Failed to fetch stock moves'
        });
    }
};


// 5. Controller for Stock Move Lines (The detailed "how" of a transfer)
export const getStockMoveLines = async (req, res) => {
    try {
        const { sessionId } = req.body;
        if (!sessionId) {
            return res.status(400).json({ message: 'Session ID is required' });
        }

        const moveLines = await odooSearchRead('stock.move.line', sessionId);

        return res.json({
            success: true,
            moveLines: moveLines
        });
        
    } catch (error) {
        console.error('Get Stock Move Lines Error:', error);
        res.status(500).json({ 
            message: 'Internal server error',
            error: error.data?.message || error.message || 'Failed to fetch stock move lines'
        });
    }
};



// 5. Controller for UOM (Units of meassure)
export const getUom = async (req, res) => {
    try {
        const { sessionId } = req.body;
        if (!sessionId) {
            return res.status(400).json({ message: 'Session ID is required' });
        }

        const uom = await odooSearchRead('uom.uom', sessionId);

        return res.json({
            success: true,
            uom: uom
        });
        
    } catch (error) {
        console.error('Get UOM Error:', error);
        res.status(500).json({ 
            message: 'Internal server error',
            error: error.data?.message || error.message || 'Failed to fetch Unit of measures'
        });
    }
};


// 6. Controller product categories
export const getCategories = async (req, res) => {
    try {
        const { sessionId } = req.body;
        if (!sessionId) {
            return res.status(400).json({ message: 'Session ID is required' });
        }

        const categories = await odooSearchRead('product.category', sessionId);

        return res.json({
            success: true,
            categories: categories
        });
        
    } catch (error) {
        console.error('Get Product Categories Error:', error);
        res.status(500).json({ 
            message: 'Internal server error',
            error: error.data?.message || error.message || 'Failed to fetch Product Categories'
        });
    }
};



// 7. Controller Stock Picking Types
export const getStockPickingTypes = async (req, res) => {
    try {
        const { sessionId } = req.body;
        if (!sessionId) {
            return res.status(400).json({ message: 'Session ID is required' });
        }

        const stockPickings = await odooSearchRead('stock.picking.type', sessionId);

        return res.json({
            success: true,
            stockPickings: stockPickings
        });
        
    } catch (error) {
        console.error('Get Stock Picking Type Error:', error);
        res.status(500).json({ 
            message: 'Internal server error',
            error: error.data?.message || error.message || 'Failed to fetch Stock Picking Type'
        });
    }
};




// 8. Controller Lots/Serial Numbers
export const getLots = async (req, res) => {
    try {
        const { sessionId } = req.body;
        if (!sessionId) {
            return res.status(400).json({ message: 'Session ID is required' });
        }

        const lots = await odooSearchRead('stock.production.lot', sessionId);

        return res.json({
            success: true,
            lots: lots
        });
        
    } catch (error) {
        console.error('Get Lots and Serial Numbers Error:', error);
        res.status(500).json({ 
            message: 'Internal server error',
            error: error.data?.message || error.message || 'Failed to fetch Lots and Serial Numbers'
        });
    }
};





// 9. Controller Inventory
export const getInventory = async (req, res) => {
    try {
        const { sessionId } = req.body;
        if (!sessionId) {
            return res.status(400).json({ message: 'Session ID is required' });
        }

        const inventory = await odooSearchRead('stock.inventory', sessionId);

        return res.json({
            success: true,
            inventory: inventory
        });
        
    } catch (error) {
        console.error('Get Stock Inventory Error:', error);
        res.status(500).json({ 
            message: 'Internal server error',
            error: error.data?.message || error.message || 'Failed to fetch Stock Inventory'
        });
    }
};


// 10. Controller Inventory
export const getInventoryLine = async (req, res) => {
    try {
        const { sessionId } = req.body;
        if (!sessionId) {
            return res.status(400).json({ message: 'Session ID is required' });
        }

        const inventoryLines = await odooSearchRead('stock.inventory.line', sessionId);

        return res.json({
            success: true,
            inventoryLines: inventoryLines
        });
        
    } catch (error) {
        console.error('Get Stock Inventory Line Error:', error);
        res.status(500).json({ 
            message: 'Internal server error',
            error: error.data?.message || error.message || 'Failed to fetch Stock Inventory Line'
        });
    }
};


