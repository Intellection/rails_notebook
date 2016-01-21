require 'fileutils'
require 'multi_json'

module RailsNotebook

  class Command

    def initialize
      ipython_dir = ENV['IPYTHONDIR'] || '~/.ipython'
      @kernel_dir  = File.join(File.expand_path(ipython_dir), 'kernels', 'rails_notebook')
      @kernel_file = File.join(@kernel_dir, 'kernel.json')
      @iruby_path  = File.expand_path $0
    end

    def run_kernel
      require 'iruby/logger'
      IRuby.logger = Rails.logger

      connection_file = ENV['connection_file']
      change_working_dir

      IRuby::Kernel.new(connection_file).run
    rescue Exception => e
      IRuby.logger.fatal "Kernel died: #{e.message}\n#{e.backtrace.join("\n")}"
      raise
    end

    def run_ipython
      check_version
      check_registered_kernel
      change_working_dir

      create_static_symlink!

      Kernel.exec('ipython', 'notebook')
    end

    private

    #================================= For Symlink
    def create_static_symlink!
      src, dst = static_path, File.join(profile_path, '/kernels/rails_notebook')
      puts src
      puts dst
      FileUtils.rm_r dst
      File.symlink src, dst
    end

    def profile_path
      `ipython locate rails_notebook`.strip
      #File.expand_path(".." , `ipython locate rails_notebook`.strip)
    end

    def static_path
      File.join(File.dirname(__FILE__), "assets")
    end
    #================================= For Symlink


    def change_working_dir
      working_dir = File.join(Rails.root, "notebooks")
      Dir.mkdir(working_dir) unless Dir.exist?(working_dir)
      Dir.chdir(working_dir) if working_dir
    end

    def check_version
      required = '3.0.0'
      version  = `ipython --version`.chomp
      if version < required
        STDERR.puts "Your IPython version #{version} is too old, at least #{required} is required"
        exit 1
      end
    end

    def check_registered_kernel
      if (kernel = registered_iruby_path)
        STDERR.puts "#{@iruby_path} differs from registered path #{registered_iruby_path}.
This might not work. Run 'iruby register --force' to fix it." if @iruby_path != kernel
      else
        register_kernel
      end
    end

    def register_kernel
      FileUtils.mkpath(@kernel_dir)

      if RUBY_PLATFORM =~ /mswin(?!ce)|mingw|cygwin/
        ruby_path, iruby_path = [RbConfig.ruby, @iruby_path].map { |path| path.gsub('/', '\\\\') }
        File.write(@kernel_file, MultiJson.dump(argv:         [ruby_path, iruby_path, 'rails_notebook_kernel', 'connection_file={connection_file}'],
                                                display_name: "Rails #{Rails.application.class.to_s}", language: 'ruby'))
      else
        File.write(@kernel_file, MultiJson.dump(argv:         [@iruby_path, 'rails_notebook_kernel', 'connection_file={connection_file}'],
                                                display_name: "Rails #{Rails.application.class.to_s}", language: 'ruby'))
      end

      FileUtils.copy(Dir[File.join(__dir__, 'assets', '*')], @kernel_dir) rescue nil
    end

    def registered_iruby_path
      File.exist?(@kernel_file) && MultiJson.load(File.read(@kernel_file))['argv'].first
    end

  end
end
