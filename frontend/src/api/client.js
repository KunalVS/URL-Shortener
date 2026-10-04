const configuredBase = import.meta.env.VITE_API_BASE_URL || "/api";
const apiBase = configuredBase.replace(/\/+$/, "");
let unauthorizedHandler;

export class ApiError extends Error {
  constructor(message, status, payload) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
}

function errorMessage(payload, fallback) {
  if (typeof payload === "string" && payload.trim()) return payload;
  if (payload && typeof payload === "object") {
    const candidates = [payload.error, payload.message, payload.detail];
    for (const value of candidates) {
      if (typeof value === "string" && value.trim()) return value;
      if (value && typeof value === "object") {
        if (typeof value.message === "string" && value.message.trim()) return value.message;
        if (typeof value.error === "string" && value.error.trim()) return value.error;
      }
    }
  }
  return fallback;
}

async function parseResponse(response) {
  if (response.status === 204) return null;
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function request(path, { method = "GET", body, authenticated = true } = {}) {
  const headers = new Headers({ Accept: "application/json" });
  const options = { method, headers };
  if (body !== undefined) {
    headers.set("Content-Type", "application/json");
    options.body = JSON.stringify(body);
  }
  if (authenticated) {
    const token = window.sessionStorage.getItem("shortly-token");
    if (token) headers.set("Authorization", "Bearer " + token);
  }

  let response;
  try {
    response = await fetch(apiBase + path, options);
  } catch {
    throw new ApiError("Could not reach the server. Check that the backend is running on port 3000.", 0);
  }

  const payload = await parseResponse(response);
  if (!response.ok) {
    if (response.status === 401 && authenticated) {
      window.sessionStorage.removeItem("shortly-token");
      if (unauthorizedHandler) unauthorizedHandler();
    }
    throw new ApiError(errorMessage(payload, "Request failed. Please try again."), response.status, payload);
  }
  return payload;
}
