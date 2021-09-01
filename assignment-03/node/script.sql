create table category (
    name varchar(45) not null, 
    primary key(name)
);

create table article (
    article_id int        not null auto_increment, 
	title    varchar(256) not null, 
    hour     tinyint      not null, 
    minute   tinyint      not null, 
    text     longtext     not null, 
    image    longtext     not null, 
    category varchar(45)  not null, 
    priority int          not null, 
    primary key(article_id), 
    foreign key (category) references category(name) 
); 

create table comment (
    comment_id int          not null auto_increment, 
    nickname   varchar(45)  not null, 
    comment    varchar(256) not null,
    article_id int          not null, 
    primary key (comment_id), 
    foreign key(article_id) references article(article_id)
)
