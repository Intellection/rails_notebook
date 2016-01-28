# Customers table initialization
ActiveRecord::Base.connection.execute("INSERT OR IGNORE INTO Customers (id,name,surname,phoneNum,address,created_at,updated_at) VALUES
	(0,'John','Smith','018-2736353','7848 Middle Acres, Soapweed, Northwest Territories, X7A-7P0, CA','2011-05-19 10:30:14','2011-08-22 22:12:55'),
	(1,'Henry','Hendle','084-8782234','4230 Cotton Dale, Fruitland, Yukon, Y2K-4B6, CA','2000-01-02 09:26:55','2002-06-30 23:44:11'),
	(2,'Jeremy','Ford','018-2736353','201 Round Nectar Street, Mesquite, Newfoundland, A1X-0D8, CA','1993-05-16 07:00:22','2015-02-14 22:34:09'),
	(3,'Kelsey','Jeanbart','057-8123456','3190 Colonial Bear Cove, Wagontire, New Brunswick, E9Z-8E6, CA','2003-04-02 05:33:41','2006-07-23 21:58:33'),
	(4,'Genoveva','Pinner','012-3456789','2145 Gentle View, Tuba City, Nova Scotia, B2D-2F5, CA','2005-05-21 13:32:49','2015-12-01 00:13:15'),
	(5,'Janel','Chesney','098-8726352','1350 Dewy Stead, Blackfoot, Alberta, T3F-0F7, CA','2002-11-29 08:28:17','2013-01-04 23:00:12'),
	(6,'Lacey','Blakso','019-2827364','8914 Red Barn Bay, Turkey Scratch, Prince Edward Island, C0E-8I2, CA','1999-05-05 16:08:01','2011-02-28 15:14:04'),
	(7,'Brad','Smith','098-7654321','4697 Crystal Via, Quashquema, Prince Edward Island, C4Y-2I9','2000-01-02 09:26:55','2002-06-30 23:44:11'),
	(8,'Denver','Henderson','092-8374812','5409 Cotton Parkway, Habit, Ontario, P6P-1F1, CA','2011-05-19 10:30:14','2011-08-22 22:12:55'),
	(9,'George','Clint','019-2837451','1787 Little Bluff Extension, Book, Alberta, T7Y-7E4, CA','2009-12-20 11:24:41','2011-10-31 14:18:53'),
	(10,'Harry','Jackson','011-1625555','4773 Burning Forest Passage, Flaming, Nova Scotia, B9N-5C4, CA','1993-05-16 07:00:22','2015-02-14 22:34:09'),
	(11,'Stewart','Nolan','019-9998877','3879 Thunder Farms, Rob Roy, Northwest Territories, X0P-0S11','2002-11-29 08:28:17','2013-01-04 23:00:12'),
	(12,'Michael','Henner','098-7678765','9532 Rustic Butterfly Vale, Four Gums, Manitoba, R0G-4D3','1999-05-05 16:08:01','2011-02-28 15:14:04'),
	(13,'Justin','Housten','029-3844433','644 Easy Parkway, Devils Ladder, Quebec, J4V-4L6, CA','2003-04-02 05:33:41','2006-07-23 21:58:33'),
	(14,'Catherine','Samuels','092-6633555','6230 Pleasant Forest Edge, Joshua Tree, Quebec, G9F-5X7','2005-05-21 13:32:49','2015-12-01 00:13:15')
	")

# Orders table initialization
ActiveRecord::Base.connection.execute("INSERT OR IGNORE INTO Orders (id,order_date,status,customer_id,created_at,updated_at) VALUES
	(000,'1993-05-16 07:00:22','Delivered',0,'2011-05-19 10:30:14','2011-08-22 22:12:55'),
	(001,'2011-02-28 15:14:04','Delivered',1,'2002-11-29 08:28:17','2013-01-04 23:00:12'),
	(002,'2015-12-01 00:13:15','Delivered',2,'2009-12-20 11:24:41','2011-10-31 14:18:53'),
	(003,'2009-12-20 11:24:41','Delivered',3,'2003-04-02 05:33:41','2006-07-23 21:58:33'),
	(004,'2011-02-28 15:14:04','Delivered',4,'1993-05-16 07:00:22','2015-02-14 22:34:09'),
	(005,'2015-12-01 00:13:15','Delivered',5,'1999-05-05 16:08:01','2011-02-28 15:14:04'),
	(006,'2011-02-28 15:14:04','Pending',6,'2011-05-19 10:30:14','2011-08-22 22:12:55'),
	(007,'2009-12-20 11:24:41','Pending',7,'2002-11-29 08:28:17','2013-01-04 23:00:12'),
	(008,'2011-02-28 15:14:04','Pending',8,'2005-05-21 13:32:49','2015-12-01 00:13:15'),
	(009,'1993-05-16 07:00:22','Pending',9,'2003-04-02 05:33:41','2006-07-23 21:58:33'),
	(010,'2015-12-01 00:13:15','Pending',10,'1993-05-16 07:00:22','2015-02-14 22:34:09'),
	(011,'2011-02-28 15:14:04','Pending',11,'2000-01-02 09:26:55','2002-06-30 23:44:11'),
	(012,'1993-05-16 07:00:22','Pending',12,'2002-11-29 08:28:17','2013-01-04 23:00:12'),
	(013,'2011-02-28 15:14:04','Cancelled',13,'2011-05-19 10:30:14','2011-08-22 22:12:55'),
	(014,'2011-02-28 15:14:04','Cancelled',14,'1999-05-05 16:08:01','2011-02-28 15:14:04')
	")

# Products table initialization
ActiveRecord::Base.connection.execute("INSERT OR IGNORE INTO Products (id,name,quantity,discount,order_id, created_at,updated_at) VALUES
	(300,'Shirts',2,50,001,'1999-05-05 16:08:01','2011-02-28 15:14:04'),
	(301,'Jeans',1,50,002,'2005-05-21 13:32:49','2015-12-01 00:13:15'),
	(302,'T-shirts',2,50,003,'1993-05-16 07:00:22','2015-02-14 22:34:09'),
	(303,'Belts',3,50,004,'2002-11-29 08:28:17','2013-01-04 23:00:12'),
	(304,'Meat',2,50,005,'2003-04-02 05:33:41','2006-07-23 21:58:33'),
	(305,'Crockery',5,50,006,'2009-12-20 11:24:41','2011-10-31 14:18:53'),
	(306,'Stamps',2,75,007,'2011-05-19 10:30:14','2011-08-22 22:12:55'),
	(307,'CDs',7,75,008,'1999-05-05 16:08:01','2011-02-28 15:14:04'),
	(308,'Cars',1,75,009,'2000-01-02 09:26:55','2002-06-30 23:44:11'),
	(309,'Batteries',1,75,010,'1993-05-16 07:00:22','2015-02-14 22:34:09'),
	(310,'Chocolate',3,75,011,'2005-05-21 13:32:49','2015-12-01 00:13:15'),
	(311,'Shoes',3,75,012,'2002-11-29 08:28:17','2013-01-04 23:00:12'),
	(312,'Slops',12,75,013,'1999-05-05 16:08:01','2011-02-28 15:14:04'),
	(313,'Jumpers',12,75,014,'2011-05-19 10:30:14','2011-08-22 22:12:55'),
	(314,'Boxes',34,75,000,'2003-04-02 05:33:41','2006-07-23 21:58:33')
	")

# Invoices table initialization
ActiveRecord::Base.connection.execute("INSERT OR IGNORE INTO Invoices (id,description,price,order_id,customer_id,created_at,updated_at) VALUES
	(00300,'ShirtsInvoice','R1,000.00',001,0,'2000-01-02 09:26:55','2002-06-30 23:44:11'),
	(00301,'JeansInvoice','R1,000.00',002,1,'1993-05-16 07:00:22','2015-02-14 22:34:09'),
	(00302,'T-shirtsInvoice','R1,000.00',003,2,'2009-12-20 11:24:41','2011-10-31 14:18:53'),
	(00303,'BeltsInvoice','R1,000.00',004,3,'1999-05-05 16:08:01','2011-02-28 15:14:04'),
	(00304,'MeatInvoice','R4,000.00',005,4,'2003-04-02 05:33:41','2006-07-23 21:58:33'),
	(00305,'CrockeryInvoice','R4,000.00',005,5,'2005-05-21 13:32:49','2015-12-01 00:13:15'),
	(00306,'StampsInvoice','R4,000.00',006,1,'2011-05-19 10:30:14','2011-08-22 22:12:55'),
	(00307,'CDsInvoice','R4,000.00',007,1,'1993-05-16 07:00:22','2015-02-14 22:34:09'),
	(00308,'CarsInvoice','R4,000.00',008,1,'2000-01-02 09:26:55','2002-06-30 23:44:11'),
	(00309,'BatteriesInvoice','R4,000.00',009,8,'1999-05-05 16:08:01','2011-02-28 15:14:04'),
	(00310,'ChocolateInvoice','R4,000.00',010,7,'1993-05-16 07:00:22','2015-02-14 22:34:09'),
	(00311,'ShoesInvoice','R4,999.00',011,9,'2003-04-02 05:33:41','2006-07-23 21:58:33'),
	(00312,'SlopsInvoice','R4,999.00',012,13,'2008-11-11','2008-11-11'),
	(00313,'JumpersInvoice','R4,999.00',013,13,'2011-05-19 10:30:14','2011-08-22 22:12:55'),
	(00314,'BoxesInvoice','R4,999.00',014,12,'2009-12-20 11:24:41','2011-10-31 14:18:53')
	")

# Articles table initialization
ActiveRecord::Base.connection.execute("INSERT OR IGNORE INTO Articles (id,title,text,created_at,updated_at) VALUES
	(0,'ArticleTitle 0','R1,000.00','2005-05-21 13:32:49','2015-12-01 00:13:15'),
	(1,'ArticleTitle 1','R1,000.00','1999-05-05 16:08:01','2011-02-28 15:14:04'),
	(2,'ArticleTitle 2','R1,000.00','2003-04-02 05:33:41','2006-07-23 21:58:33'),
	(3,'ArticleTitle 3','R1,000.00','1993-05-16 07:00:22','2015-02-14 22:34:09'),
	(4,'ArticleTitle 4','R4,000.00','2000-01-02 09:26:55','2002-06-30 23:44:11'),
	(5,'ArticleTitle 5','R4,000.00','2009-12-20 11:24:41','2011-10-31 14:18:53'),
	(6,'ArticleTitle 6','R4,000.00','2011-05-19 10:30:14','2011-08-22 22:12:55'),
	(7,'ArticleTitle 7','R4,000.00','2009-12-20 11:24:41','2011-10-31 14:18:53'),
	(8,'ArticleTitle 8','R4,000.00','2000-01-02 09:26:55','2002-06-30 23:44:11'),
	(9,'ArticleTitle 9','R4,000.00','1993-05-16 07:00:22','2015-02-14 22:34:09'),
	(10,'ArticleTitle 10','R4,000.00','2003-04-02 05:33:41','2006-07-23 21:58:33'),
	(11,'ArticleTitle 11','R4,999.00','2005-05-21 13:32:49','2015-12-01 00:13:15'),
	(12,'ArticleTitle 12','R4,999.00','1999-05-05 16:08:01','2011-02-28 15:14:04'),
	(13,'ArticleTitle 13','R4,999.00','2011-05-19 10:30:14','2011-08-22 22:12:55'),
	(14,'ArticleTitle 14','R4,999.00','2009-12-20 11:24:41','2011-10-31 14:18:53')
	")

# Comments table initialization
ActiveRecord::Base.connection.execute("INSERT OR IGNORE INTO Comments (id,commenter,body,article_id,customer_id,created_at,updated_at) VALUES
	(0,'Commenter 000','Mission accomplished. It is fabulous.',0,0,'2002-11-29 08:28:17','2013-01-04 23:00:12'),
	(1,'Commenter 001','Such fun.',1,1,'2003-04-02 05:33:41','2006-07-23 21:58:33'),
	(2,'Commenter 002','Such experience, many hero, so simple',2,2,'2009-12-20 11:24:41','2011-10-31 14:18:53'),
	(3,'Commenter 003','42 is the answer to the universe and everything',3,3,'1993-05-16 07:00:22','2015-02-14 22:34:09'),
	(4,'Commenter 004','This texture blew my mind.',4,4,'1999-05-05 16:08:01','2011-02-28 15:14:04'),
	(5,'Commenter 005','Background image, typography, shot, job – killer :)',5,5,'2000-01-02 09:26:55','2002-06-30 23:44:11'),
	(6,'Commenter 006','You just won the internet!',6,6,'2005-05-21 13:32:49','2015-12-01 00:13:15'),
	(7,'Commenter 007','I want to learn this kind of style! Teach me.',7,7,'1999-05-05 16:08:01','2011-02-28 15:14:04'),
	(8,'Commenter 008','Splendid work you have here.',8,8,'2002-11-29 08:28:17','2013-01-04 23:00:12'),
	(9,'Commenter 009','This is minimal work.',9,9,'2005-05-21 13:32:49','2015-12-01 00:13:15'),
	(10,'Commenter 010','This colour has navigated right into my heart.',10,10,'1993-05-16 07:00:22','2015-02-14 22:34:09'),
	(11,'Commenter 011','42 is the answer to the universe and everything',11,11,'2003-04-02 05:33:41','2006-07-23 21:58:33'),
	(12,'Commenter 012','I think I am crying. It is that classic.',12,12,'2009-12-20 11:24:41','2011-10-31 14:18:53'),
	(13,'Commenter 013','Fresh :) I approve the use of background image and type!',13,13,'1999-05-05 16:08:01','2011-02-28 15:14:04'),
	(14,'Commenter 014','SURPRISE!',14,14,'2002-11-29 08:28:17','2013-01-04 23:00:12')
	")
