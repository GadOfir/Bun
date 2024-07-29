import { serve } from "bun";
import mqtt from "mqtt";

// MQTT client setup
const mqttClient = mqtt.connect('mqtt://10.0.1.20');

mqttClient.on('connect', () => {
  console.log('Connected to MQTT broker');
  mqttClient.subscribe('/buntest', (err) => {
    if (err) {
      console.error('Subscription error:', err);
    } else {
      console.log('Subscribed to /buntest');
    }
  });
});

let lastMessage = '';

mqttClient.on('message', (topic, message) => {
  if (topic === '/buntest') {
    lastMessage = message.toString();
    console.log('Received message:', lastMessage);
  }
});

// Web server setup
const server = serve({
  port: 3000,
  fetch(req) {
    return new Response(lastMessage ? `Latest message: ${lastMessage}` : 'No messages received yet', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  },
});

console.log(`Server is running at http://localhost:${server.port}`);
