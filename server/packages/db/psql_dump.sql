CREATE table list
(
    id    serial primary key,
    title char(40),
    body  char(140),
    done  bool
);