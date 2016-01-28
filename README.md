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

Copyright 2016 Brendon McLean

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.