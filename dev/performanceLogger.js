const tick = Date.now();
const log = (v, msg) => console.log(`\n ${v} Elapsed since initial tick: ${Date.now() - tick} ms \n Execution point: ${msg} \n`);

export { log }