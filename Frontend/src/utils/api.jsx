import { toast } from "../components/ui/use-toast";

const env = (key, fallback) => {
  const v = import.meta.env[key];
  return v && v !== "" ? v : fallback;
};

const BASE = env("VITE_API_BASE_URL", "");
const JOBS = env("VITE_API_JOBS_BASE_URL", BASE);
const AUTH = env("VITE_API_AUTH_BASE_URL", BASE);
const APPS = env("VITE_API_APPLICATIONS_BASE_URL", BASE);

export const endpoints = {
  auth: {
    register: `${AUTH}/register`,
    login: `${AUTH}/login`,
    adminLogin: `${AUTH}/admin/login`,
  },
  jobs: {
    list: `${JOBS}/getjobs`,
    byId: (id) => `${JOBS}/${id}`,
    create: `${JOBS}/create`,
    update: (id) => `${JOBS}/update/${id}`,
    remove: (id) => `${JOBS}/delete/${id}`,
    apply: (id) => `${JOBS}/${id}`,
  },
  applications: {
    mine: `${APPS}/my`,
    adminAll: `${APPS}/`,
  },
};

async function fetchJSON(
  url,
  { method = "GET", token, body, headers = {} } = {}
) {
  const opts = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    credentials: "include", // <-- Add this line
  };
  if (token) {
    opts.headers.Authorization = `Bearer ${token}`;
  }
  if (body !== undefined) {
    opts.body = JSON.stringify(body);
  }
  const res = await fetch(url, opts);
  let data = null;
  const text = await res.text();
  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    data = { message: text || "Unknown response" };
  }
  if (!res.ok) {
    const msg = data?.message || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data;
}

export const api = {
  register: (payload) =>
    fetchJSON(endpoints.auth.register, { method: "POST", body: payload }),
  loginUser: (payload) =>
    fetchJSON(endpoints.auth.login, { method: "POST", body: payload }),
  loginAdmin: (payload) =>
    fetchJSON(endpoints.auth.adminLogin, { method: "POST", body: payload }),

  getJobs: () => fetchJSON(endpoints.jobs.list),
  getJobById: (id) => fetchJSON(endpoints.jobs.byId(id)),
  createJob: (payload, token) =>
    fetchJSON(endpoints.jobs.create, { method: "POST", body: payload, token }),
  updateJob: (id, payload, token) =>
    fetchJSON(endpoints.jobs.update(id), {
      method: "PUT",
      body: payload,
      token,
    }),
  deleteJob: (id, token) =>
    fetchJSON(endpoints.jobs.remove(id), { method: "DELETE", token }),
  applyToJob: (id, payload, token) =>
    fetchJSON(endpoints.jobs.apply(id), {
      method: "POST",
      body: payload,
      token,
    }),

  getMyApplications: (token) =>
    fetchJSON(endpoints.applications.mine, { token }),
  getAllApplications: (token) =>
    fetchJSON(endpoints.applications.adminAll, { token }),
};

// Helper to show a generic "not implemented" toast
export function notImplemented() {
  toast({
    title: "Heads up!",
    description:
      "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
  });
}
