$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "rails_notebook/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "rails_notebook"
  s.version     = RailsNotebook::VERSION
  s.authors     = ["Brendon McLean"]
  s.email       = ["brendon@intellectionsoftware.com"]
  s.homepage    = "TODO"
  s.summary     = "TODO: Summary of RailsNotebook."
  s.description = "TODO: Description of RailsNotebook."
  s.license     = "MIT"

  s.files = Dir["{app,config,db,lib}/**/*", "MIT-LICENSE", "Rakefile", "README.rdoc"]

  s.add_dependency "rails", "~> 4.2.5"
  s.add_dependency "iruby"

  s.add_development_dependency "sqlite3"
end
