import axios from 'axios';
import dotenv from 'dotenv';
import { getSettings } from './settingsStore.js';
dotenv.config();

const envUrl = process.env.URL;
const resolveUrl = (override) => {
  const settings = getSettings();
  return override || settings.baseUrl || envUrl;
}

// Call Odoo's report service directly via /jsonrpc
export async function odooCallReportService(method, sessionId, args = [], kwargs = {}, { baseUrl } = {}) {
  if (!sessionId) {
    throw new Error('Session ID is required');
  }
  const url = resolveUrl(baseUrl);

  const response = await axios.post(
    `${url}/jsonrpc`,
    {
      jsonrpc: '2.0',
      method: 'call',
      params: {
        service: 'report',
        method,
        args,
        kwargs,
      },
      id: Date.now(),
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Cookie: `session_id=${sessionId}`,
      },
    }
  );

  if (response.data?.error) {
    const err = new Error(response.data.error?.message || 'Odoo JSON-RPC error');
    err.data = response.data.error;
    throw err;
  }

  return response.data?.result;
}

export async function odooCallMethod(model, method, sessionId, args = [], kwargs = {}, { baseUrl } = {}) {
  if (!sessionId) {
    throw new Error('Session ID is required');
  }
  const url = resolveUrl(baseUrl);

  const response = await axios.post(
    `${url}/web/dataset/call_kw`,
    {
      jsonrpc: '2.0',
      params: {
        model,
        method,
        args,
        kwargs,
      },
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Cookie: `session_id=${sessionId}`,
      },
    }
  );

  if (response.data?.error) {
    const err = new Error(response.data.error?.message || 'Odoo JSON-RPC error');
    err.data = response.data.error;
    throw err;
  }

  return response.data?.result;
}

export async function odooSearchRead(model, sessionId, { args = [], kwargs = {}, baseUrl } = {}) {
  if (!sessionId) {
    throw new Error('Session ID is required');
  }
  const url = resolveUrl(baseUrl);
  const response = await axios.post(
    `${url}/web/dataset/call_kw`,
    {
      jsonrpc: '2.0',
      params: {
        model,
        method: 'search_read',
        args,
        kwargs,
      },
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Cookie: `session_id=${sessionId}`,
      },
    }
  );

  if (response.data?.error) {
    const err = new Error(response.data.error?.message || 'Odoo JSON-RPC error');
    err.data = response.data.error;
    throw err;
  }

  return response.data?.result || [];
}

export async function odooFieldsGet(model, sessionId, { attributes = [], baseUrl } = {}) {
  if (!sessionId) {
    throw new Error('Session ID is required');
  }
  const url = resolveUrl(baseUrl);

  const response = await axios.post(
    `${url}/web/dataset/call_kw`,
    {
      jsonrpc: '2.0',
      params: {
        model,
        method: 'fields_get',
        args: [],
        kwargs:{},
      },
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Cookie: `session_id=${sessionId}`,
      },
    }
  );

  if (response.data?.error) {
    const err = new Error(response.data.error?.message || 'Odoo JSON-RPC error');
    err.data = response.data.error;
    throw err;
  }

  return response.data?.result || {};
}

export async function odooCreate(model, sessionId, values = {}, { baseUrl } = {}) {
  if (!sessionId) {
    throw new Error('Session ID is required');
  }
  const url = baseUrl || envUrl;

  const response = await axios.post(
    `${url}/web/dataset/call_kw`,
    {
      jsonrpc: '2.0',
      params: {
        model,
        method: 'create',
        args: [values],
        kwargs: {},
      },
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Cookie: `session_id=${sessionId}`,
      },
    }
  );

  if (response.data?.error) {
    const err = new Error(response.data.error?.message || 'Odoo JSON-RPC error');
    err.data = response.data.error;
    throw err;
  }

  return response.data?.result || false; // returns new record id
}

export async function odooWrite(model, sessionId, ids = [], values = {}, { baseUrl } = {}) {
  if (!sessionId) {
    throw new Error('Session ID is required');
  }
  const url = baseUrl || envUrl;

  const response = await axios.post(
    `${url}/web/dataset/call_kw`,
    {
      jsonrpc: '2.0',
      params: {
        model,
        method: 'write',
        args: [ids, values],
        kwargs: {},
      },
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Cookie: `session_id=${sessionId}`,
      },
    }
  );

  if (response.data?.error) {
    const err = new Error(response.data.error?.message || 'Odoo JSON-RPC error');
    err.data = response.data.error;
    throw err;
  }

  return response.data?.result || false;
}

export async function odooRead(model, sessionId, ids = [], fields = [], { baseUrl } = {}) {
  if (!sessionId) {
    throw new Error('Session ID is required');
  }
  const url = baseUrl || envUrl;

  const response = await axios.post(
    `${url}/web/dataset/call_kw`,
    {
      jsonrpc: '2.0',
      params: {
        model,
        method: 'read',
        args: [ids, fields],
        kwargs: {},
      },
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Cookie: `session_id=${sessionId}`,
      },
    }
  );

  if (response.data?.error) {
    const err = new Error(response.data.error?.message || 'Odoo JSON-RPC error');
    err.data = response.data.error;
    throw err;
  }

  return response.data?.result || [];
}
