// Simple central place for talking to our backend.

export const BASE_URL =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:8000"
    : "https://shopingappkle-egs3.onrender.com";


// Common fetch function
export async function apiFetch(
  path,
  { method = "GET", body, auth = false } = {}
) {

  const headers = {
    "Content-Type": "application/json",
  };


  // Attach JWT token for protected routes
  if (auth) {
    const token = localStorage.getItem("token");

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }


  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });


  const data = await response.json();


  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }


  return data;
}