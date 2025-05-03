<?php

return [
    'storage' => [
        'name'      => env('AZURE_STORAGE_NAME'),
        'key'       => env('AZURE_STORAGE_KEY'),
        'container' => env('AZURE_STORAGE_CONTAINER'),
        'url'       => env('AZURE_STORAGE_URL'),
    ],
];