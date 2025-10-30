import { odooSearchRead } from './odooClient.js';

export async function getProjects(req, res) {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });

    const projects = await odooSearchRead('project.project', sessionId);
    return res.json({ success: true, projects });
  } catch (error) {
    console.error('Get Projects Error:', error?.data || error.message);
    return res.status(500).json({ message: 'Internal server error', error: error?.data || error.message });
  }
}
