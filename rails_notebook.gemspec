$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "rails_notebook/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "rails_notebook"
  s.date        = Date.today.to_s
  s.version     = RailsNotebook::VERSION
  s.authors     = ["Brendon McLean"]
  s.email       = ["brendon@intellectionsoftware.com"]
  s.summary     = %q{Rails Notebook is a web-based notebook environment for interactive computing}
  s.description = %q{Run Rails commands in your web browser for some customised, useful outputs}
  s.homepage    = ""
  s.license     = "MIT"

  s.files = Dir["{app,config,db,lib}/**/*", "MIT-LICENSE", "Rakefile", "README.rdoc"]
  s.require_paths = ["lib/rails_notebook"]

  s.required_ruby_version = '>= 2.2.1'

  s.add_dependency "rails", "~> 4.2.5"
  s.add_dependency "iruby"
  s.add_dependency "rbczmq"
  s.add_dependency "stackprof"

  s.add_development_dependency "fast_stack" 
  s.add_development_dependency "sqlite3"
  s.add_development_dependency "semvergen"
end
