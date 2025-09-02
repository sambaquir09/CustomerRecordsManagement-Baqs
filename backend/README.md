## Run Local Development
Make sure you **open Docker Desktop** before doing this.

### If you have already built the container, run this command. If not, run the steps below.
```
docker-compose up -d
```

### Step 1: If you have not built the container yet, first run this. This will install dependencies.
```
docker-compose run --rm api composer install
```

### Step 2: Then run this to build the container with the dependencies from above.
```
docker-compose build
```
Once done, simple run the command on **Step 1**.

### Step 3: If you want to stop the container from running, run this:
```
docker-compose down
```

## Accessing Bash To Apply Database Changes

### To access the container and run commands, run this:
```
docker-compose exec api bash
```
### If there are update to the database tables or columns, run this:
```
php artisan migrate
```

### To migrate database fresh
```
php artisan migrate:fresh
```