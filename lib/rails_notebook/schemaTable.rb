module SchemaTable
	def self.bar_chart( activeRecordRelation )
		data = activeRecordRelation.count
		ChartRenderer.new( data , "BarChart")
	end

	def self.pie_chart( activeRecordRelation )
		puts activeRecordRelation
	end

	def self.line_graph( activeRecordRelation )
		puts activeRecordRelation
	end

	class ChartRenderer
        def initialize( data, chartType )
            @data = data
            @chartType = chartType
        end
        def data
        	@data
        end
        def chartType
        	@chartType
        end
    end
end