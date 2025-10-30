import { odooSearchRead, odooWrite, odooCreate, odooCallMethod, odooCallReportService } from './odooClient.js';
import axios from 'axios';

export async function getPickings(req, res) {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });

    const pickings = await odooSearchRead('stock.picking', sessionId);
    return res.json({ success: true, pickings });
  } catch (error) {
    console.error('Get Pickings Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}

export async function validatePicking(req, res) {
  try {
    const { sessionId } = req.body;
    const id = parseInt(req.params.id, 10);
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });
    if (!id || isNaN(id)) return res.status(400).json({ message: 'Valid ID param is required' });

    const result = await odooCallMethod('stock.picking', 'button_validate', sessionId, [[id]], {});
    return res.json({ success: true, result });
  } catch (error) {
    console.error('Validate Picking Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}

export async function printPicking(req, res) {
  try {
    const { sessionId } = req.body;
    const id = parseInt(req.params.id, 10);

    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });
    if (!id || isNaN(id)) return res.status(400).json({ message: 'Valid ID param is required' });

    const baseUrl = process.env.URL;
    const reportExternalId = 'stock.action_report_picking'; 

    // Request PDF via /report/download (Odoo 17–18 compatible)
    const payload = {
      data: JSON.stringify([reportExternalId, [id], 'pdf']),
      context: {}, // optional
    };
I
    const response = await axios.post(`${baseUrl}/report/download`, payload, {
      headers: {
        'Content-Type': 'application/json',
        Cookie: `session_id=${sessionId}`,
      },
      responseType: 'arraybuffer',
    });

    // Ensure Odoo returned PDF data
    if (response.headers['content-type']?.includes('html')) {
      const htmlText = response.data.toString('utf-8');
      console.error('Odoo returned HTML instead of PDF:\n', htmlText.slice(0, 300));
      throw new Error('Odoo returned HTML instead of PDF. Check permissions or report ID.');
    }

    const pdfBase64 = Buffer.from(response.data, 'binary').toString('base64');
    const filename = `picking_${id}.pdf`;

    return res.json({ success: true, pdfBase64, filename });
  } catch (error) {
    console.error('Print Picking Error:', error?.response?.data?.toString() || error.message);
    return res.status(500).json({
      message: 'Failed to generate picking PDF',
      error: error.message || 'Unknown error',
    });
  }
}

export async function returnPicking(req, res) {
  try {
    const { sessionId, kwargs = {} } = req.body;
    const id = parseInt(req.params.id, 10);
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });
    if (!id || isNaN(id)) return res.status(400).json({ message: 'Valid ID param is required' });

    // Minimal call to create a return. If lines are provided, forward in kwargs
    const result = await odooCallMethod('stock.picking', 'action_return', sessionId, [[id]], kwargs);
    // Some versions may return an action or new picking id. Pass through.
    return res.json({ success: true, result });
  } catch (error) {
    console.error('Return Picking Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}

export async function cancelPicking(req, res) {
  try {
    const { sessionId } = req.body;
    const id = parseInt(req.params.id, 10);
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });
    if (!id || isNaN(id)) return res.status(400).json({ message: 'Valid ID param is required' });

    const result = await odooCallMethod('stock.picking', 'action_cancel', sessionId, [[id]], {});
    return res.json({ success: true, result });
  } catch (error) {
    console.error('Cancel Picking Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}


export async function createPicking(req, res) {
  try {
    const { sessionId, values } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });
    if (!values || typeof values !== 'object') return res.status(400).json({ message: 'Values payload is required' });

    const newId = await odooCreate('stock.picking', sessionId, values);
    return res.json({ success: !!newId, id: newId });
  } catch (error) {
    console.error('Create Picking Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}

export async function updatePicking(req, res) {
  try {
    const { sessionId, values } = req.body;
    const id = parseInt(req.params.id, 10);
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });
    if (!id || isNaN(id)) return res.status(400).json({ message: 'Valid ID param is required' });
    if (!values || typeof values !== 'object') return res.status(400).json({ message: 'Values payload is required' });

    const result = await odooWrite('stock.picking', sessionId, [id], values);
    return res.json({ success: !!result });
  } catch (error) {
    console.error('Update Picking Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}
