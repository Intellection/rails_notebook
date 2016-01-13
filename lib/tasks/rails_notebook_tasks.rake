desc "Rails notebook"
task :rails_notebook do
  RailsNotebook::Command.new.run_ipython
end

task :rails_notebook_kernel => :environment do
  RailsNotebook::Command.new.run_kernel
end