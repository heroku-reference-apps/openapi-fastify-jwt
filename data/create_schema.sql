create table users(username varchar(24) not null unique primary key, first_name varchar(64) not null, last_name varchar(64) not null, email text not null, password text not null);
