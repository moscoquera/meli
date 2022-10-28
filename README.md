# meli

## Requeriments

* docker compose

## Setup

open a terminal and:
1. `docker build -t meli-base -f base.Dockerfile .`
2. then run: `docker compose up db`, and wait until the DB is initialized.
   

    meli-db-1  | 2022-10-28T19:59:06.988836Z 0 [System] [MY-013602] [Server] Channel mysql_main configured to support TLS. Encrypted connections are now supported for this channel.
    meli-db-1  | 2022-10-28T19:59:06.990753Z 0 [Warning] [MY-011810] [Server] Insecure configuration for --pid-file:    Location '/var/run/mysqld' in the path is accessible to all OS users. Consider choosing a different directory.
    meli-db-1  | 2022-10-28T19:59:07.007846Z 0 [System] [MY-011323] [Server] X Plugin ready for connections. Bind-address: '::' port: 33060, socket: /var/run/mysqld/mysqlx.sock
    meli-db-1  | 2022-10-28T19:59:07.007974Z 0 [System] [MY-010931] [Server] /usr/sbin/mysqld: ready for connections. Version: '8.0.31'  socket: '/var/run/mysqld/mysqld.sock'  port: 3306  MySQL Community Server - GPL.

3. then run: `docker compose up` to mount all the services.
4. finally open `http://localhost:3040` in a browser to access to the frontend
