/*
    General Redis run-time variables are defined here.
    Cache period related vars are defined in units of second.
    e.g. 60 x 60 = 3600 = 1 hour
*/

const config = {
    files_api_response_cache_period: 14400, // 4 hours
    projects_api_response_cache_period: 604800 // 1 week
}

export { config }