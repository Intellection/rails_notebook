class Route
	def initialize( _uriPattern , _verb , _controller , _action )
		@uriPattern = _uriPattern
		@verb = _verb
		@controller = _controller
		@action = _action
	end
end