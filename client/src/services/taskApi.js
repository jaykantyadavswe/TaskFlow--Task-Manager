const API_URL = import.meta.env.VITE_API_URL;

async function request(path, options = {}) {
    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    const contentType = response.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
        throw new Error(
            `Expected a JSON response from ${response.url}, but received ${contentType || "an unknown content type"}. Check VITE_API_URL and make sure the API server is running.`,
        );
    }

    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.message || "Something went wrong");
    }

    return result.data;
}

// API functions for tasks
export const getTasks = async () => {
    return request("/tasks");
};

// API functions for individual task operations
export const getTaskById = async (id) => {
    return request(`/tasks/${id}`);
};

// API functions for creating, updating, and deleting tasks
export const createTask = async (task) => {
    return request("/tasks", {
        method: "POST",
        body: JSON.stringify(task)
    });
};

export const updateTask = async (id, task) => {
    return request(`/tasks/${id}`, {
        method: "PATCH",
        body: JSON.stringify(task)
    });
};

export const deleteTask = async (id) => {
    return request(`/tasks/${id}`, {
        method: "DELETE"
    });
};