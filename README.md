## Rails notebook

Welcome to Rails Notebook! Rails Notebook is a web-based notebook environment for interactive computing, specifically geared for Ruby on Rails.

## User Installation Guide

Add this line to your application's Gemfile:

    gem 'rails_notebook'

And then execute the following from the rool of your Rails application:

	$ bundle
	$ bundle update

Please ensure that the following dependencies are installed prior to running the Rails Notebook.

    ipython 3.0.0 and above, ruby 2.2.1 and above
    Python 2.7.11 (Rails Notebook not compatible with Python 3)

To start the notebook navigate to the root of the Rails application (if not already) and run:

    rake rails_notebook

Running the notebook for the first time, requires the notebook to be marked as "Trusted" under File > Trusted Notebook. You may be prompted to restart the notebook.

## Some useful commands:

To display the application's routes:

	Rails.application.routes

To view an ER diagram of the current database:

	ActiveRecord::Base.connection.tables

To query the top 10 records of a table:

	table_name.all

To graph a group query into a bar chart:

	SchemaTable::bar_chart(Model.group(:column_name))

# Developer Installation Guide
Follow the following instructions to get rvm and ruby installed: https://rvm.io/rvm/install . The rails notebook is compatible with Ruby 2.2.1 and above. Once rvm is installed, run:

    rvm install ruby 2.2.1

Ensure that rvm is using the correct ruby version by running:

    ruby --version 
    -> 2.2.1p85

If this is the incorrect version, run:
    
    rvm use ruby 2.2.1
    
Next, from https://repo.continuum.io/archive/index.html, download Anaconda 2.4.1. Ensure that "Anaconda2" is precedes the file name (for Python 2.7)
    
    e.g., for MacOSX: Anaconda2-2.4.1-MacOSX-x86_64.sh (PYTHON 2.7 NB)

To install Anaconda, navigate to the directory with the downloaded .sh file and run:

    bash Anaconda2-2.4.1-MacOSX-x86_64.sh

Make sure there is no ~/Library/Jupyter/kernels directory. If there is, make sure this is removed before running.

Next, ensure that Anaconda is added to your PATH variable by adding the following line to ~/.bash_profile:
    
    export PATH="/Path/To../anaconda2/bin:$PATH"

Restart the terminal before proceeding.

## Validating your environment

To ensure that the correct dependencies have been installed, run the following:

    which anaconda 
    > /Path/To../bin/anaconda
    which python 
    > /Path/To../anaconda/bin/python
    python --version 
    > 2.7.11, Anaconda 2.4.1

If the above are incorrect, you likely need to update your PATH variable in ~/.bash_profile and restart the terminal.

## Almost there:

Next, clone the Rails_notebook repository by running:

    git clone https://github.com/Intellection/rails_notebook.git /Path/To../rails_notebook
    cd /Path/To../rails_notebook

Then install the required gems (this may take some time):
    
    gem install bundler
    bundle install
    bundle update


Open lib/rails_notebook/command.rb with your editor and uncomment (line 32):
    
    # create_static_symlink!

Save and exit.

## Test your installation
The repository comes with an example Rails application. To test the Rails Notebook, change to the test_app directory located under spec/test_app and run:

    rake db:reset db:seed
    rake rails_notebook

Open the railsNotebook.ipynb notebook. Upon the first time running the notebook select "Trust Notebook" via:
    
    File > Trust Notebook
    
Then restart the notebook via the Terminal (CTRL+C twice)

Finally, run the notebook again using:
    
    rake rails_notebook

## Some useful commands:

To display the application's routes:

	Rails.application.routes

To view an ER diagram of the current database:

	ActiveRecord::Base.connection.tables

To query the top 10 records of a table:

	Customer.all

To graph a group query into a bar chart:

	SchemaTable::bar_chart(Order.group(:status))

## Why does Rails_notebook exist?

The Rails Notebook is a web application that allows you to create and share documents that contain live code, equations, visualizations and explanatory text.
## Core aims of Rails_notebook

Visualization of: 

1) Database queries

2) Database Schema

3) Flame charts

4) Routes

5) Barcharts 

... and more to come.



## Contributors

@Brendon, @Nick, @Tsu-Shiuan

## License
See [LICENSE](./MIT-LICENSE)