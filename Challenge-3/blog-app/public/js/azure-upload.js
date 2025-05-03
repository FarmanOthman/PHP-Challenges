/**
 * Azure Blob Storage direct upload using SAS tokens
 */
class AzureUploader {
    constructor(options = {}) {
        this.tokenEndpoint = options.tokenEndpoint || '/azure/sas-token';  // Updated to use web route instead of API route
        this.csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
        this.onProgress = options.onProgress || (() => {});
        this.onSuccess = options.onSuccess || (() => {});
        this.onError = options.onError || (() => {});
    }

    /**
     * Fetch SAS token from server
     */
    async getSasToken(filename = null, permissions = 'w', expiry = 60) {
        try {
            const endpoint = new URL(this.tokenEndpoint, window.location.origin);
            
            // Add query parameters if provided
            if (filename) endpoint.searchParams.append('filename', filename);
            if (permissions) endpoint.searchParams.append('permissions', permissions);
            if (expiry) endpoint.searchParams.append('expiry', expiry);

            // Build headers object conditionally
            const headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            };
            
            // Only add CSRF token if it exists
            if (this.csrfToken) {
                headers['X-CSRF-TOKEN'] = this.csrfToken;
            }

            // Add credentials to ensure cookies are sent
            const response = await fetch(endpoint.toString(), {
                method: 'GET',
                credentials: 'same-origin', // Include cookies for same-origin requests
                headers: headers
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('SAS token response error:', errorText);
                throw new Error(`Failed to get SAS token: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error getting SAS token:', error);
            this.onError(error);
            throw error;
        }
    }

    /**
     * Upload file directly to Azure Blob Storage using SAS token
     */
    async uploadFile(file, customFilename = null) {
        try {
            // Generate a filename based on the original file if not provided
            const filename = customFilename || 
                `${file.name.split('.')[0]}_${Date.now()}.${file.name.split('.').pop()}`;

            // Get SAS token from server
            const sasData = await this.getSasToken(filename);
            
            // Upload directly to Azure using the SAS token
            const xhr = new XMLHttpRequest();
            
            // Track upload progress
            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percentComplete = Math.round((event.loaded / event.total) * 100);
                    this.onProgress(percentComplete, event);
                }
            };

            // Set up promise to track completion
            const uploadPromise = new Promise((resolve, reject) => {
                xhr.onload = function() {
                    if (this.status >= 200 && this.status < 300) {
                        resolve({
                            blobName: sasData.blobName,
                            url: sasData.baseUrl,
                            container: sasData.container
                        });
                    } else {
                        reject(new Error(`Upload failed with status: ${this.status}`));
                    }
                };
                
                xhr.onerror = () => reject(new Error('Upload failed'));
            });

            // Configure and send the request
            xhr.open('PUT', sasData.uri);
            xhr.setRequestHeader('x-ms-blob-type', 'BlockBlob');
            xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');
            xhr.send(file);
            
            // Wait for upload to complete
            const result = await uploadPromise;
            this.onSuccess(result);
            return result;
        } catch (error) {
            console.error('Error uploading to Azure:', error);
            this.onError(error);
            throw error;
        }
    }
}

// Make available globally
window.AzureUploader = AzureUploader;