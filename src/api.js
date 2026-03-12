import axios from "axios";

const api = axios.create({
    // baseURL: "http://127.0.0.1:8000/api",
    baseURL: "https://api.kalingangkababaihan.com/api",
    withCredentials: true,
});

api.interceptors.request.use((config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const _get = (url, config = {}) => {
    return api.get(url, config);
}

// const _post = (url, data = {}, config = {}) => {
//     return api.post(url, data, config);
// }

// const _put = (url, data = {}, config = {}) => {
//     return api.put(url, data, config);
// }

const _post = (url, data = {}, config = {}) => {
    let finalConfig = { ...config };

    if (data instanceof FormData) {
        finalConfig.headers = {
            ...(config.headers || {}),
        };
        if ("Content-Type" in finalConfig.headers) {
            delete finalConfig.headers["Content-Type"];
        }
        if ("content-type" in finalConfig.headers) {
            delete finalConfig.headers["content-type"];
        }
    } else {
        finalConfig.headers = {
            ...(config.headers || {}),
            "Content-Type": "application/json",
        };
    }

    return api.post(url, data, finalConfig);
};

const _put = (url, data = {}, config = {}) => {

    let finalConfig = { ...config };

    if (data instanceof FormData) {
        finalConfig.headers = {
            ...(config.headers || {}),
        };
        if ("Content-Type" in finalConfig.headers) {
            delete finalConfig.headers["Content-Type"];
        }
        if ("content-type" in finalConfig.headers) {
            delete finalConfig.headers["content-type"];
        }
    } else {
        finalConfig.headers = {
            ...(config.headers || {}),
            "Content-Type": "application/json",
        };
    }

    return api.put(url, data, finalConfig);
};

const _delete = (url, config = {}) => {
    return api.delete(url, config);
}

export { _get, _post, _put, _delete };
