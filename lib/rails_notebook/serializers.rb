module RailsNotebook

  module Serializers

    @to_json_serializers = [
      Fixnum, String, Float, TrueClass, FalseClass, Hash, Array, Set
    ].to_set

    @object_serializers = {
      Rails::Application => [
        "app",
        "assets",
        "assets_manifest",
        "config",
        "console",
        "default_url_options",
        "endpoint",
        "engine_name",
        "env_config",
        "generators",
        "helpers",
        "helpers_paths",
        "initialize!",
        "initialized?",
        "initializer",
        "initializers",
        "isolate_namespace",
        "isolated?",
        "key_generator",
        "message_verifier",
        "middleware",
        "migration_railties",
        "paths",
        "railtie_name",
        "railtie_namespace",
        "railties",
        "rake_tasks",
        "reloaders",
        "root",
        "routes",
        "routes?",
        "routes_reloader",
        "run_load_hooks!",
        "runner",
        "sandbox",
        "sandbox?",
        "secrets",
        "watchable_args"
      ]
    }

    def self.serialize(obj)
      if object_serializable?(obj.class)
        object_attribs(obj.class).map do |method|
          serialize(obj.send(method))
        end
      elsif to_json_serializable? obj.class
        obj.to_json
      else
        obj.inspect.truncate(100)
      end
    end

    private

    def self.object_serializable?(obj_class)
      object_attribs obj_class
    end

    def self.to_json_serializable?(object_class)
      if @to_json_serializers.include? object_class
        true
      elsif object_class.superclass
        to_json_serializable? object_class.superclass
      else
        false
      end
    end

    def self.object_attribs(object_class)
      if @object_serializers.has_key? object_class
        @object_serializers[object_class]
      elsif object_class.superclass
        object_attribs object_class.superclass
      else
        false
      end
    end

  end

end