export async function postRequest(url, params) {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(params),
    });
  
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
  
    return response.json();
  }
  
  export function parseQueryString(query) {
    const params = new URLSearchParams(query);
    return Object.fromEntries(params.entries());
  }
  