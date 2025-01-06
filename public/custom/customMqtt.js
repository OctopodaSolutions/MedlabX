// function to handle subscribing and receiving messages
function subscribeAndListenToTopic(topicName, returnFeed) {
    // Subscribe to the topic
    global.MqttClient.subscribe({ name: topicName, returnFeed: returnFeed });
  
    // Listen for incoming messages on the topic
    global.MqttClient.onMessage((topic, message) => {
      if (topic === topicName) {
        console.log('Received msg:', message.toString());
      }
    });
}
  
module.exports = { subscribeAndListenToTopic };
  