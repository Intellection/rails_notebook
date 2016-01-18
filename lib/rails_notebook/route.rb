class RouteNode

	def initialize( _uriPattern , _verb , _controller , _action )
		@uriPattern = _uriPattern
		_verb ? @verbs = [_verb] : @verbs = []
		@controller = _controller
		_action ? @actions = [_action] : @actions = []
		@childrenNodes = []
	end

	def updateParams( _verb , _controller , _action )
		@verbs << _verb unless _verb.nil?
		@controller = _controller
		@actions << _action unless _action.nil?
	end

	def verbs
  		@verbs
	end

	def verb
  		@verbs.first
	end

	def controller
		@controller
	end

	def actions
		@actions
	end

	def action
		@actions.first
	end

	def uriPattern
  		@uriPattern
	end

	def getChildren
  		@childrenNodes
	end

	def hasRoute( uri_mapping )
		@childrenNodes.each do |childNode|
			if childNode == uri_mapping 
				return childNode
			end
		end
		return false
	end

	def insertChild( childNode )
		@childrenNodes << childNode
	end

	def ==( uri_mapping )
    	self.uriPattern == uri_mapping
  	end

  	def printNode
  		puts "====================NODE===================="
  		puts @uriPattern
		puts @verbs
		puts @controller
		puts @actions
		puts "============================================"
		@childrenNodes.each do |child|
			child.printNode
		end
	end
end



class RouteTree
	def initialize( _headNode )
		@headNode = _headNode
	end

	def insertNode( _node )
		#Get route mapping and iteratively either walk the tree or insert a node at the correct position
		uri_mapping = ""
		thisNode = @headNode
		_node.uriPattern.split("/").each do |uri|
            uri_mapping += uri + "/"
            if uri_mapping[0...-1] == _node.uriPattern 
            	# If we are at the correct node
            	if thisNode.hasRoute( uri_mapping )
            		# Update the parameters to include details
            		thisNode.hasRoute( uri_mapping ).updateParams( _node.verb , _node.controller , _node.action )
            		return 
            	else 
            		# Insert a new child node
            		child = RouteNode.new( uri_mapping , _node.verb , _node.controller , _node.action )
            		thisNode.insertChild( child )
            		return
            	end
            elsif thisNode.hasRoute( uri_mapping )
            	# node exists so walk the tree
            	thisNode = thisNode.hasRoute( uri_mapping )
            else
            	# node doesn't exist so temporarily insert as placeholder
            	child = RouteNode.new( uri_mapping , nil, nil , nil )
            	thisNode.insertChild( child )
            	thisNode = child
            end
        end
	end

	def removeNode( _node )
		puts "removing node"
	end

	def getRoot
		@headNode
	end

	def printTree
		@headNode.printNode
	end	
end