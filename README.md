## Rails notebook

Welcome to Rails Notebook! Rails Notebook is a web-based notebook environment for interactive computing, specifically geared for Ruby on Rails.

## Installation

Add this line to your application's Gemfile:

    gem 'rails_notebook'

And then execute:

	$ bundle

Make sure there is no ~/Library/Jupyter/kernels directory. If there is, make sure this is removed before running.

Please ensure that the following dependencies are installed prior to running the Rails Notebook.

1) ipython - 4.0.2

2) Rails - 4.2.5

3) conda 3.19.0

4) ruby 2.2.1p85

5) sqlite 3.9.2

6) Anaconda 2.1.0

7) Python 2.7.11 (comes with Anaconda 2.1.0)


ZeroMQ is a high-performance asynchronous messaging library, aimed at use in scalable distributed or concurrent applications.

Install via Homebrew:

	$ brew tap homebrew/versions

	$ brew install zeromq

Run to start the notebook navigate to the root of the Rails application and run:

    rake rails_notebook

Also ensure that the notebook is marked as a "Trusted" under File > Trusted Notebook. You may be prompted to restart the notebook.

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