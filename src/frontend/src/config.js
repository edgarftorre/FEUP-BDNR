export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

const config = Object.freeze({
    BACKEND_URL: BACKEND_URL,
})

export default config;