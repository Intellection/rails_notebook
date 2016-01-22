# This is a table container class, used to display Schema.
# Author = Tsu-Shiuan Lin

class Table

	def initialize( _table_name, _columns, _arrowsTo )
		@table_name = _table_name
		@columns = _columns
		@arrowsTo = _arrowsTo
	end

	def table_name # Holds the table name
		@table_name
	end

	def columns # Holds the column names of the table
		@columns
	end

	def arrowsTo # Holds a list of the table names corresponding to the foreign keys
		@arrowsTo
	end
	
	def printTable
		puts "Table Name = "+ @table_name.to_s + "\n" + "Columns = " + @columns.to_s + "\n" + "Points to  = " + @arrowsTo.to_s + "\n"
	end

end # end class Table