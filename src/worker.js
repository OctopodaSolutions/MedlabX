// // worker.js

// eslint-disable-next-line no-restricted-globals
self.addEventListener('message', function(e) {
  let data;

    try{
      data=JSON.parse(e.data);
    }
    catch(e){
      console.log("Unable to parse data",e);
      data={};
    }

    const processedData = processData(data);
    postMessage(JSON.stringify(processedData));
  });
  
  function processData(data) {
    // Assume some data processing here
    data.timestamp = Date.now();  // For example, adding a timestamp
    return data;  // Return the processed data back to the main thread
  }
  