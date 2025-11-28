// import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import httpRequest from "@/utils/httpRequest";

const baseQuery = async (args) => {
    const isObject = typeof args === "object";
    const config = {
        url: isObject ? args.url : args,
        method: isObject ? args.method : "GET",
    };
    if (isObject) {
        if (args.body) config.data = args.body;
        if (args.headers) config.headers = args.headers;
    }

    try {
        const response = await httpRequest(config);
        return response;
    } catch (error) {
        return { error };
    }
};

export default baseQuery;
