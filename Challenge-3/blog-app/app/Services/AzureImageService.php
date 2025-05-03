<?php

namespace App\Services;

use MicrosoftAzure\Storage\Blob\BlobRestProxy;
use MicrosoftAzure\Storage\Blob\Models\CreateBlobOptions;
use MicrosoftAzure\Storage\Common\Exceptions\ServiceException;
use MicrosoftAzure\Storage\Blob\BlobSharedAccessSignatureHelper;
use MicrosoftAzure\Storage\Common\Internal\Resources;
use Illuminate\Http\UploadedFile;

class AzureImageService
{
    protected $blobClient;
    protected $container;
    protected $accountName;
    protected $accountKey;
    
    public function __construct()
    {
        $this->accountName = config('azure.storage.name');
        $this->accountKey = config('azure.storage.key');
        $this->container = config('azure.storage.container');
        
        $connectionString = sprintf(
            "DefaultEndpointsProtocol=https;AccountName=%s;AccountKey=%s",
            $this->accountName,
            $this->accountKey
        );
        
        $this->blobClient = BlobRestProxy::createBlobService($connectionString);
    }
    
    /**
     * Generate SAS token for client-side upload
     *
     * @param string|null $blobName Custom blob name or auto-generated
     * @param string $permissions Permissions ('r'=read, 'w'=write, 'd'=delete, etc.)
     * @param int $expiryMinutes Minutes until token expires
     * @return array Token, URI, and blob details
     */
    public function generateSasToken(string $blobName = null, string $permissions = "rw", int $expiryMinutes = 60): array
    {
        $blobName = $blobName ?: $this->generateUniqueBlobName();
        
        // Create helper instance with account name and key
        $helper = new BlobSharedAccessSignatureHelper($this->accountName, $this->accountKey);
        
        // Set start time (now) and expiry time
        $startTime = new \DateTime('now', new \DateTimeZone('UTC'));
        $expiryTime = (clone $startTime)->modify("+{$expiryMinutes} minutes");
        
        // Generate SAS token with correct method and parameters
        $sasToken = $helper->generateBlobServiceSharedAccessSignatureToken(
            Resources::RESOURCE_TYPE_BLOB,
            "{$this->container}/{$blobName}",
            $permissions,
            $expiryTime,
            $startTime
        );
        
        $blobUrl = $this->getUrl($blobName);
        
        return [
            'token' => $sasToken,
            'uri' => $blobUrl . '?' . $sasToken,
            'blobName' => $blobName,
            'container' => $this->container,
            'account' => $this->accountName,
            'baseUrl' => $blobUrl
        ];
    }
    
    /**
     * Server-side upload using account key (for trusted operations)
     */
    public function upload(UploadedFile $file, string $filename = null): string
    {
        $filename = $filename ?: $this->generateFilename($file);
        $content = fopen($file->getRealPath(), "r");
        
        try {
            $options = new CreateBlobOptions();
            $options->setContentType($file->getClientMimeType());
            
            $this->blobClient->createBlockBlob(
                $this->container,
                $filename,
                $content,
                $options
            );
            
            return $this->getUrl($filename);
        } finally {
            if (is_resource($content)) {
                fclose($content);
            }
        }
    }
    
    /**
     * Delete a blob from Azure Storage
     */
    public function delete(string $filename): bool
    {
        try {
            $this->blobClient->deleteBlob($this->container, $filename);
            return true;
        } catch (ServiceException $e) {
            if ($e->getCode() !== 404) {
                throw $e;
            }
            return false;
        }
    }
    
    /**
     * Generate a unique filename for an uploaded file
     */
    protected function generateFilename(UploadedFile $file): string
    {
        return sprintf(
            "%s_%s.%s",
            pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME),
            uniqid(),
            $file->getClientOriginalExtension()
        );
    }
    
    /**
     * Generate a unique blob name for SAS token
     */
    protected function generateUniqueBlobName(): string
    {
        return sprintf("blob_%s.jpg", uniqid());
    }
    
    /**
     * Get the full URL for a blob
     */
    public function getUrl(string $filename): string
    {
        return sprintf(
            "https://%s.blob.core.windows.net/%s/%s",
            $this->accountName,
            $this->container,
            $filename
        );
    }
    
    /**
     * Test Azure connectivity by listing blobs
     */
    public function testConnection()
    {
        try {
            $result = $this->blobClient->listBlobs($this->container);
            return $result->getBlobs();
        } catch (ServiceException $e) {
            throw new \RuntimeException(
                "Azure connection failed: " . $e->getMessage(),
                $e->getCode(),
                $e
            );
        }
    }
}