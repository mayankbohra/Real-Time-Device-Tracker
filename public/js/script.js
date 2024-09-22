const socket = io();
// console.log("connected to server");

if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        console.log("Sending location:", latitude, longitude);
        socket.emit('sendLocation', { latitude, longitude });
    }, (error) => {
        console.log(error);
    },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        });
}

const map = L.map("map").setView([0, 0], 16);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
}).addTo(map);

const marker = {};

socket.on('locationMessage', (data) => {
    console.log("Location received:", data); 
    const { id, latitude, longitude } = data;

    if (marker[id]) {
        marker[id].setLatLng([latitude, longitude]);
    } else {
        marker[id] = L.marker([latitude, longitude]).addTo(map);
    }

    map.setView([latitude, longitude], 16); 
});


socket.on('disconnectMessage', (data) => {
    const { id } = data;
    if (marker[id]) {
        map.removeLayer(marker[id]);
        delete marker[id];
    }
});
