document.addEventListener('DOMContentLoaded', () => {
    const recordButton = document.getElementById('recordButton');
    const transcriptDiv = document.getElementById('transcript');
    const statusDiv = document.getElementById('status');

    let isRecording = false;
    let mediaRecorder;
    let audioChunks = [];
    let socket;
    let currentAiResponseElement = null;

    function connectWebSocket() {
        socket = new WebSocket('ws://localhost:3001');

        socket.onopen = () => {
            console.log('WebSocket connected!');
            statusDiv.textContent = 'Connected. Click the button to talk.';
            recordButton.disabled = false;
        };

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            
            if (message.type === 'text') {
                if (!currentAiResponseElement) {
                    currentAiResponseElement = document.createElement('p');
                    currentAiResponseElement.innerHTML = '<strong>Rev:</strong> ';
                    transcriptDiv.appendChild(currentAiResponseElement);
                }
                currentAiResponseElement.innerHTML += message.data;
                scrollToBottom();
            } else if (message.type === 'stream_end') {
                currentAiResponseElement = null;
                statusDiv.textContent = 'Ready. Click the button to talk.';
            } else if (message.type === 'error') {
                statusDiv.textContent = `Error: ${message.data}`;
                currentAiResponseElement = null; 
            }
        };

        socket.onclose = () => {
            console.log('WebSocket disconnected. Attempting to reconnect...');
            statusDiv.textContent = 'Connection lost. Retrying...';
            setTimeout(connectWebSocket, 3000); 
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
            statusDiv.textContent = 'Connection error. Please refresh the page.';
            recordButton.disabled = true;
        };
    }

    async function toggleRecording() {
        if (!isRecording) {
           
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

                mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        audioChunks.push(event.data);
                    }
                };

                mediaRecorder.onstop = () => {
                   
                    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                    const userEntry = document.createElement('p');
                    userEntry.innerHTML = '<strong>You:</strong> [speaking...]';
                    transcriptDiv.appendChild(userEntry);
                    scrollToBottom();
                    
                   
                    if (socket.readyState === WebSocket.OPEN) {
                        socket.send(audioBlob);
                    }
                    
                    audioChunks = [];
                };

                mediaRecorder.start();
                isRecording = true;
                recordButton.classList.add('is-recording');
                statusDiv.textContent = 'Listening... Click again to stop.';
               
                currentAiResponseElement = null;

            } catch (error) {
                console.error('Error accessing microphone:', error);
                statusDiv.textContent = 'Could not access microphone. Please grant permission.';
            }
        } else {
            
            mediaRecorder.stop();
            isRecording = false;
            recordButton.classList.remove('is-recording');
            statusDiv.textContent = 'Processing... Please wait.';
        }
    }
    
    function scrollToBottom() {
        transcriptDiv.scrollTop = transcriptDiv.scrollHeight;
    }

    
    recordButton.addEventListener('click', toggleRecording);
    recordButton.disabled = true; 
    connectWebSocket();
});