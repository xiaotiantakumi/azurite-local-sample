create table db.sample_table
(
    id         bigint auto_increment
        primary key,
    name       varchar(255)                              not null comment '名前',
    age        int                                       not null comment '年齢',
    address    varchar(255)                              null comment '住所',
    created_at datetime(6)  default CURRENT_TIMESTAMP(6) not null comment '作成日時',
    created_by varchar(255) default 'system'             not null comment '作成者',
    updated_at datetime(6)  default CURRENT_TIMESTAMP(6) not null on update CURRENT_TIMESTAMP(6) comment '更新日時',
    updated_by varchar(255) default 'system'             not null comment '更新者'
);
INSERT INTO db.sample_table (name, age, address)
VALUES ('John Doe', 30, '123 Main St'),
       ('Jane Doe', 28, '456 Elm St'),
       ('Jim Smith', 35, '789 Oak St'),
       ('Jill Johnson', 32, '321 Pine St'),
       ('Joe Brown', 40, '654 Maple St'),
       ('Julia Davis', 36, '987 Cedar St'),
       ('Jake Miller', 45, '213 Birch St'),
       ('Jennifer Wilson', 38, '546 Willow St'),
       ('Jason Taylor', 42, '879 Poplar St'),
       ('Jessica Thomas', 39, '312 Chestnut St');
