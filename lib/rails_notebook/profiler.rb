#https://github.com/SamSaffron/flamegraph/
#Modified from Sam Saffron's original code for flamegraph
require "json"

module Profiler
  def self.profile(filename=nil, opts = {})
    fidelity = opts[:fidelity]  || 0.05
    backtraces = FastStack.profile(fidelity) do yield end # I think the sampling rate is 0.05ms -> work with that 
    Profiler::Profile.new( Profiler::generate_data( backtraces ) , fidelity )
  end

  def self.generate_data( stacks )
    table = []
    prev = []

    # a 2d array makes collapsing easy
    stacks.each_with_index do |stack, pos|
      next unless stack
      col = []

      stack.reverse.map{|r| r.to_s}.each_with_index do |frame, i|
        if !prev[i].nil?
          last_col = prev[i]
          if last_col[0] == frame
            last_col[1] += 1
            col << nil
            next
          end
        end

        prev[i] = [frame, 1]
        col << prev[i]
      end
      prev = prev[0..col.length-1].to_a
      table << col
    end

    data = []
    # a 1d array makes rendering easy
    table.each_with_index do |col, col_num|
      col.each_with_index do |row, row_num|
        next unless row && row.length == 2
        data << {
          :x => col_num + 1,
          :y => row_num + 1,
          :width => row[1],
          :frame => row[0]
        }
      end
    end
    data
  end

  class Profile
    def initialize( data, _sampleTime )
      @data = data
      @sampleTime = _sampleTime
    end
  end
end
