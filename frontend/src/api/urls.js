import { request } from "./client.js";

export function shortenUrl(url, code) {
  const body = { url };
  if (code) body.code = code;
  return request("/shorten", { method: "POST", body });
}

export async function getMyUrls() {
  const result = await request("/myurls");
  if (!result || !Array.isArray(result.myurls)) {
    throw new Error("The server response did not include a URL list.");
  }
  return result.myurls;
}

export function updateCode(id, code) {
  return request("/updatecode/" + encodeURIComponent(id), {
    method: "PATCH",
    body: { code },
  });
}

export function updateUrl(id, url) {
  return request("/updateurl/" + encodeURIComponent(id), {
    method: "PATCH",
    body: { url },
  });
}

export function deleteUrl(id) {
  return request("/" + encodeURIComponent(id), { method: "DELETE" });
}
