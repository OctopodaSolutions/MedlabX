// // worker.js

// eslint-disable-next-line no-restricted-globals
self.addEventListener('message', function(e) {
  console.log("Message from Worker",e);
  let data;
    if (typeof(e)==Object){
      data=e.data;
    }
    else{
      data=JSON.parse(e.data);
    }
    // const data = JSON.parse(e.data);
    const processedData = processData(data);
    postMessage(JSON.stringify(processedData));
  });
  
  function processData(data) {
    // Assume some data processing here
    data.timestamp = Date.now();  // For example, adding a timestamp
    return data;  // Return the processed data back to the main thread
  }
  