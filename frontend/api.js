// Define the base URL of your backend API.
// It's a good practice to have this in one place.
const BASE_URL = 'http://localhost:5000/api';

/**
 * A helper function to handle fetch responses.
 * @param {Response} response - The response from the fetch call.
 * @returns {Promise<any>} The JSON data from the response.
 * @throws {Error} If the network response was not ok.
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    // Try to parse the error message from the backend, or use the status text.
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'An unknown error occurred');
  }
  return response.json();
};

/**
 * Fetches a list of users from the backend.
 * @returns {Promise<Array<any>>} A promise that resolves to an array of users.
 */
export const getUsers = async () => {
  try {
    const response = await fetch(`${BASE_URL}/users`);
    return handleResponse(response);
  } catch (error) {
    console.error('Failed to fetch users:', error);
    throw error; // Re-throw the error to be caught by the component
  }
};

/**
 * Creates a new user by sending data to the backend.
 * @param {object} userData - The data for the new user (e.g., { name: 'John Doe' }).
 * @returns {Promise<any>} A promise that resolves to the newly created user data.
 */
export const createUser = async (userData) => {
  try {
    const response = await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Failed to create user:', error);
    throw error;
  }
};

// You can add more functions for other endpoints (GET, POST, PUT, DELETE) here...
// export const getProducts = async () => { ... };
// export const deleteUser = async (userId) => { ... };