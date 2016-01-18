class RouteNode

	def initialize( _uriPattern , _verb , _controller , _action )
		@uriPattern = _uriPattern
		_verb ? @verbs = [_verb] : @verbs = []
		@controller = _controller
		_action ? @actions = [_action] : @actions = []
		@countChildrenNodes = 0
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
	def getCountChildrenNodes
		@countChildrenNodes
	end

	def hasRoute( uri_mapping )
		@childrenNodes.each do |childNode|
			if childNode.uriPattern == uri_mapping 
				return childNode
			end
		end
		return false
	end

	def insertChild( childNode )
		@childrenNodes << childNode
	end

  	def countChildrenNodes( count )
    	@childrenNodes.each do |child|
    		count = count + child.countChildrenNodes(0)
    	end
    	@countChildrenNodes = count
    	count += 1
    	return count
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
		thisNode = @headNode #always insert from the headNode

		_node.uriPattern.split("/").each do |uri|
            uri_mapping += uri + "/"
            if uri_mapping[0...-1] == _node.uriPattern || uri_mapping == _node.uriPattern # We are at node to insert or update
            	if thisNode.uriPattern == uri_mapping # Update the parameters to include details
            		thisNode.updateParams( _node.verb , _node.controller , _node.action ) 
            	elsif thisNode.hasRoute( uri_mapping )
            		thisNode.hasRoute( uri_mapping ).updateParams( _node.verb , _node.controller , _node.action )
            	else 
            		child = RouteNode.new( uri_mapping , _node.verb , _node.controller , _node.action )
            		thisNode.insertChild( child )
            	end
            elsif thisNode.hasRoute( uri_mapping ) # node exists so walk the tree
            	thisNode = thisNode.hasRoute( uri_mapping )
            elsif thisNode.uriPattern == uri_mapping # already there
            	thisNode.updateParams( _node.verb , _node.controller , _node.action )
            else
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