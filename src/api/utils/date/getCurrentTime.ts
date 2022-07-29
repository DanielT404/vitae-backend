const getCurrentTime = (): string => {
    const date = new Date();
    const formattedTime = new Date(date).toLocaleTimeString();
    return formattedTime;
}

export { getCurrentTime }