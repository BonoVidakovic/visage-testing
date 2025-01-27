create table public.users
(
    id       uuid not null
        primary key,
    username varchar(256),
    password varchar(265)
);

alter table public.users
    owner to my_user;

create table public.refresh_tokens
(
    user_id  uuid         not null
        constraint fk_user_id
            references public.users
            on update cascade on delete cascade,
    token    varchar(256) not null
        primary key,
    is_valid boolean
);

alter table public.refresh_tokens
    owner to my_user;

create table public.movies
(
    id           uuid          not null
        primary key,
    title        varchar(255)  not null,
    release_year varchar(4)    not null,
    genre        varchar(100)  not null,
    runtime      varchar(10)   not null,
    language     varchar(50)   not null,
    rating       numeric(2, 1) not null,
    poster       varchar(255)  not null
);

alter table public.movies
    owner to my_user;

create table public.movies_reviews
(
    id       uuid not null
        primary key,
    movie_id uuid
        references public.movies,
    rating   numeric(2, 1),
    content  text
);

alter table public.movies_reviews
    owner to my_user;

create table public.user_movie_favorite
(
    user_id  uuid not null
        references public.users,
    movie_id uuid not null
        references public.movies,
    primary key (user_id, movie_id)
);

alter table public.user_movie_favorite
    owner to my_user;

