# Customers table initialization
ActiveRecord::Base.connection.execute("INSERT INTO Customers (id,name,surname,phoneNum,address,created_at,updated_at) VALUES
	(0,'John','Smith','0182736353','defaultAddress1111','2008-11-11','2008-11-11'),
	(1,'Henry','Hendle','0848782234','defaultAddress1112','2008-11-11','2008-11-11'),
	(2,'Jeremy','Ford','0182736353','defaultAddress1113','2008-11-11','2008-11-11'),
	(3,'Kelsey','Jeanbart','0578123456','defaultAddress1114','2008-11-11','2008-11-11'),
	(4,'Genoveva','Pinner','0123456789','defaultAddress1115','2008-11-11','2008-11-11'),
	(5,'Janel','Chesney','0988726352','defaultAddress1116','2008-11-11','2008-11-11'),
	(6,'Lacey','Blakso','0192827364','defaultAddress1117','2008-11-11','2008-11-11'),
	(7,'Brad','Smith','0987654321','defaultAddress1118','2008-11-11','2008-11-11'),
	(8,'Denver','Henderson','0928374812','defaultAddress1119','2008-11-11','2008-11-11'),
	(9,'George','Clint','0192837451','defaultAddress1141','2008-11-11','2008-11-11'),
	(10,'Harry','Jackson','0111625555','defaultAddress1131','2008-11-11','2008-11-11'),
	(11,'Stewart','Nolan','0199998877','defaultAddress11221','2008-11-11','2008-11-11'),
	(12,'Michael','Henner','0987678765','defaultAddress11121','2008-11-11','2008-11-11'),
	(13,'Justin','Housten','0293844433','defaultAddress199','2008-11-11','2008-11-11'),
	(14,'Catherine','Samuels','0926633555','defaultAddress1199','2008-11-11','2008-11-11')
	")

# Orders table initialization
ActiveRecord::Base.connection.execute("INSERT INTO Orders (id,order_date,status,customer_id,created_at,updated_at) VALUES
	(000,'2016-01-11','Delivered',0,'2008-11-11','2008-11-11'),
	(001,'2016-01-12','Delivered',1,'2008-11-11','2008-11-11'),
	(002,'2016-01-13','Delivered',2,'2008-11-11','2008-11-11'),
	(003,'2016-01-14','Delivered',3,'2008-11-11','2008-11-11'),
	(004,'2016-01-13','Delivered',4,'2008-11-11','2008-11-11'),
	(005,'2016-01-12','Delivered',5,'2008-11-11','2008-11-11'),
	(006,'2016-01-13','Pending',6,'2008-11-11','2008-11-11'),
	(007,'2016-01-14','Pending',7,'2008-11-11','2008-11-11'),
	(008,'2016-01-13','Pending',8,'2008-11-11','2008-11-11'),
	(009,'2016-01-12','Pending',9,'2008-11-11','2008-11-11'),
	(010,'2016-01-13','Pending',10,'2008-11-11','2008-11-11'),
	(011,'2016-01-14','Pending',11,'2008-11-11','2008-11-11'),
	(012,'2016-01-15','Pending',12,'2008-11-11','2008-11-11'),
	(013,'2016-01-16','Cancelled',13,'2008-11-11','2008-11-11'),
	(014,'2016-01-16','Cancelled',14,'2008-11-11','2008-11-11')
	")

# Products table initialization
ActiveRecord::Base.connection.execute("INSERT INTO Products (id,name,quantity,discount,order_id, created_at,updated_at) VALUES
	(300,'Shirts',2,50,001,'2008-11-11','2008-11-11'),
	(301,'Jeans',1,50,002,'2008-11-11','2008-11-11'),
	(302,'T-shirts',2,50,003,'2008-11-11','2008-11-11'),
	(303,'Belts',3,50,004,'2008-11-11','2008-11-11'),
	(304,'Meat',2,50,005,'2008-11-11','2008-11-11'),
	(305,'Crockery',5,50,006,'2008-11-11','2008-11-11'),
	(306,'Stamps',2,75,007,'2008-11-11','2008-11-11'),
	(307,'CDs',7,75,008,'2008-11-11','2008-11-11'),
	(308,'Cars',1,75,009,'2008-11-11','2008-11-11'),
	(309,'Batteries',1,75,010,'2008-11-11','2008-11-11'),
	(310,'Chocolate',3,75,011,'2008-11-11','2008-11-11'),
	(311,'Shoes',3,75,012,'2008-11-11','2008-11-11'),
	(312,'Slops',12,75,013,'2008-11-11','2008-11-11'),
	(313,'Jumpers',12,75,014,'2008-11-11','2008-11-11'),
	(314,'Boxes',34,75,000,'2008-11-11','2008-11-11')
	")

# Invoices table initialization
ActiveRecord::Base.connection.execute("INSERT INTO Invoices (id,description,price,order_id,customer_id,created_at,updated_at) VALUES
	(00300,'ShirtsInvoice','R1,000.00',001,0,'2008-11-11','2008-11-11'),
	(00301,'JeansInvoice','R1,000.00',002,1,'2008-11-11','2008-11-11'),
	(00302,'T-shirtsInvoice','R1,000.00',003,2,'2008-11-11','2008-11-11'),
	(00303,'BeltsInvoice','R1,000.00',004,3,'2008-11-11','2008-11-11'),
	(00304,'MeatInvoice','R4,000.00',005,4,'2008-11-11','2008-11-11'),
	(00305,'CrockeryInvoice','R4,000.00',005,5,'2008-11-11','2008-11-11'),
	(00306,'StampsInvoice','R4,000.00',006,1,'2008-11-11','2008-11-11'),
	(00307,'CDsInvoice','R4,000.00',007,1,'2008-11-11','2008-11-11'),
	(00308,'CarsInvoice','R4,000.00',008,1,'2008-11-11','2008-11-11'),
	(00309,'BatteriesInvoice','R4,000.00',009,8,'2008-11-11','2008-11-11'),
	(00310,'ChocolateInvoice','R4,000.00',010,7,'2008-11-11','2008-11-11'),
	(00311,'ShoesInvoice','R4,999.00',011,9,'2008-11-11','2008-11-11'),
	(00312,'SlopsInvoice','R4,999.00',012,13,'2008-11-11','2008-11-11'),
	(00313,'JumpersInvoice','R4,999.00',013,13,'2008-11-11','2008-11-11'),
	(00314,'BoxesInvoice','R4,999.00',014,12,'2008-11-11','2008-11-11')
	")

# Articles table initialization
ActiveRecord::Base.connection.execute("INSERT INTO Articles (id,title,text,created_at,updated_at) VALUES
	(0,'ArticleTitle0','R1,000.00','2008-11-11','2008-11-11'),
	(1,'ArticleTitle1','R1,000.00','2008-11-11','2008-11-11'),
	(2,'ArticleTitle2','R1,000.00','2008-11-11','2008-11-11'),
	(3,'ArticleTitle3','R1,000.00','2008-11-11','2008-11-11'),
	(4,'ArticleTitle4','R4,000.00','2008-11-11','2008-11-11'),
	(5,'ArticleTitle5','R4,000.00','2008-11-11','2008-11-11'),
	(6,'ArticleTitle6','R4,000.00','2008-11-11','2008-11-11'),
	(7,'ArticleTitle7','R4,000.00','2008-11-11','2008-11-11'),
	(8,'ArticleTitle8','R4,000.00','2008-11-11','2008-11-11'),
	(9,'ArticleTitle9','R4,000.00','2008-11-11','2008-11-11'),
	(10,'ArticleTitle10','R4,000.00','2008-11-11','2008-11-11'),
	(11,'ArticleTitle11','R4,999.00','2008-11-11','2008-11-11'),
	(12,'ArticleTitle12','R4,999.00','2008-11-11','2008-11-11'),
	(13,'ArticleTitle13','R4,999.00','2008-11-11','2008-11-11'),
	(14,'ArticleTitle14','R4,999.00','2008-11-11','2008-11-11')
	")

# Comments table initialization
ActiveRecord::Base.connection.execute("INSERT INTO Comments (id,commenter,body,article_id,customer_id,created_at,updated_at) VALUES
	(0,'Commenter0','Insert some body text here',0,0,'2008-11-11','2008-11-11'),
	(1,'Commenter1','Insert some body text here',1,1,'2008-11-11','2008-11-11'),
	(2,'Commenter2','Insert some body text here',2,2,'2008-11-11','2008-11-11'),
	(3,'Commenter3','Insert some body text here',3,3,'2008-11-11','2008-11-11'),
	(4,'Commenter4','Insert some body text here',4,4,'2008-11-11','2008-11-11'),
	(5,'Commenter5','Insert some body text here',5,5,'2008-11-11','2008-11-11'),
	(6,'Commenter6','Insert some body text here',6,6,'2008-11-11','2008-11-11'),
	(7,'Commenter7','Insert some body text here',7,7,'2008-11-11','2008-11-11'),
	(8,'Commenter8','Insert some body text here',8,8,'2008-11-11','2008-11-11'),
	(9,'Commenter9','Insert some body text here',9,9,'2008-11-11','2008-11-11'),
	(10,'Commenter10','Insert some body text here',10,10,'2008-11-11','2008-11-11'),
	(11,'Commenter11','Insert some body text here',11,11,'2008-11-11','2008-11-11'),
	(12,'Commenter12','Insert some body text here',12,12,'2008-11-11','2008-11-11'),
	(13,'Commenter13','Insert some body text here',13,13,'2008-11-11','2008-11-11'),
	(14,'Commenter14','SURPRISE!',14,14,'2008-11-11','2008-11-11')
	")
