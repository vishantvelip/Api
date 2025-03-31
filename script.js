    async function uploadSongs() {
            const fileInput = document.getElementById('songFile');
            const uploadMessage = document.getElementById('uploadMessage');
            const files = fileInput.files;

            if (files.length === 0) {
                uploadMessage.textContent = 'Please select at least one song file.';
                uploadMessage.style.color = 'red';
                return;
            }

            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
                formData.append('songs[]', files[i]); // Use 'songs[]' for array on the server
            }

            uploadMessage.textContent = 'Uploading files...';
            uploadMessage.style.color = 'orange';

            try {
                const response = await fetch('/upload', { // Replace '/upload' with your server-side endpoint
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    const data = await response.json();
                    uploadMessage.textContent = data.message || 'Songs uploaded successfully!';
                    uploadMessage.style.color = 'green';
                    // Optionally clear the file input
                    fileInput.value = '';
                } else {
                    const errorData = await response.json();
                    uploadMessage.textContent = errorData.error || 'Failed to upload songs.';
                    uploadMessage.style.color = 'red';
                }
            } catch (error) {
                console.error('Error uploading songs:', error);
                uploadMessage.textContent = 'An error occurred during upload.';
                uploadMessage.style.color = 'red';
            }
    }
