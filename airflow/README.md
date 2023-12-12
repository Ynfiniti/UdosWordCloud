init airflow by running docker-compose in project-root-directory

# init airflow

```sh
docker build --pull --rm -f "airflow\Dockerfile" -t udoswordcloud:latest "airflow"
```



```sh
docker-compose up --build
```

open in browser

```
http://localhost:8080
```

to login use username

```
admin
```

and password from generated file "airflow/standalone_admin_password.txt"