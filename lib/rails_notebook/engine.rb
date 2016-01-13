module RailsNotebook
  class Engine < ::Rails::Engine
    isolate_namespace RailsNotebook

    config.generators do |g|
      g.test_framework :rspec
    end
  end
end
