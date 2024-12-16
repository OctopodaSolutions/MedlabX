// import Worker from "worker-loader!./worker.js";
import Worker from "./worker";
/**
 * A class to manage a pool of Web Workers for parallel task processing.
 */
export class WorkerPool {
    /**
     * @param {number} workerCount - The number of workers to create in the pool.
     * @param {string} workerScript - The URL of the worker script.
     */
    constructor(workerCount, workerScript) {
        this.workers = [];
        this.freeWorkers = [];
        this._onProcessedData = null; // Initialize the callback to null

        // Create and initialize the workers
        for (let i = 0; i < workerCount; i++) {
            const worker = new Worker(workerScript);
            worker.onmessage = this.handleMessage.bind(this, worker);
            this.workers.push(worker);
            this.freeWorkers.push(worker);
        }
    }

    /**
     * Handles messages from workers. Adds the worker back to the free pool and invokes the data callback.
     * @param {Worker} worker - The worker that sent the message.
     * @param {MessageEvent} event - The message event from the worker.
     */
    handleMessage(worker, event) {
        this.freeWorkers.push(worker);
        if (this._onProcessedData) {
            this._onProcessedData(JSON.parse(event.data));
        }
    }

    /**
     * Posts a task to a free worker. If no workers are available, logs an error.
     * @param {*} task - The task to send to the worker.
     */
    postMessage(task) {
        if (this.freeWorkers.length > 0) {
            const worker = this.freeWorkers.pop();
            worker.postMessage(task);
        } else {
            console.error("No available workers in the WorkerPool");
        }
    }

    /**
     * Terminates all workers in the pool.
     */
    terminate() {
        this.workers.forEach(worker => worker.terminate());
    }

    /**
     * Sets the callback function to be called when data is processed by a worker.
     * @param {Function} callback - The callback function.
     */
    set onProcessedData(callback) {
        this._onProcessedData = callback;
    }

    /**
     * Gets the current callback function for processed data.
     * @returns {Function|null} - The callback function, or null if not set.
     */
    get onProcessedData() {
        return this._onProcessedData;
    }
}

