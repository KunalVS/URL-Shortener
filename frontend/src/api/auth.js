import { request } from "./client.js";

export function signUp(details) {
  return request("/user/signup", {
    method: "POST",
    body: details,
    authenticated: false,
  });
}

export function login(credentials) {
  return request("/user/login", {
    method: "POST",
    body: credentials,
    authenticated: false,
  });
}
