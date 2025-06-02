FROM php:8.2-cli

# Install system dependencies
RUN apt-get update && \
    apt-get install -y unzip git zlib1g-dev libzip-dev && \
    docker-php-ext-install zip

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

WORKDIR /var/www/html

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
