export async function fetchJson(input, init) {
  const response = await fetch(input, init);
  const text = await response.text();

  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch (error) {
      throw new Error(
        `Invalid JSON response from ${response.url || "request"}: ${
          error.message
        }`
      );
    }
  }

  if (!response.ok) {
    const message =
      (data && (data.error || data.message)) ||
      response.statusText ||
      `Request failed with status ${response.status}`;
    const err = new Error(message);
    err.status = response.status;
    err.details = data;
    throw err;
  }

  return data;
}
