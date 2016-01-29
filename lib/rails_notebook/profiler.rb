#https://github.com/SamSaffron/flamegraph/
#Modified from Sam Saffron's original code for flamegraph
require "json"
require "stackprof"

module Profiler
    def self.profile(filename=nil, opts = {})
        backtraces = nil;
        fidelity = opts[:fidelity]  || 0.05
        backtraces = StackProfSampler.collect( fidelity ) do yield end
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
                    :x      => col_num + 1,
                    :y      => row_num + 1,
                    :width  => row[1],
                    :frame  => row[0]
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

    class StackProfSampler
        def self.collect(fidelity=0.5)
            result = StackProf.run(mode: :wall,
                           raw: true,
                           aggregate: false,
                           interval: (fidelity * 1000).to_i) do
                yield
            end

            stacks = []
            stack = []

            return [] unless result[:raw]

            length = nil
            result[:raw].each do |i|
                if length.nil?
                    length = i
                next
                end

                if length > 0
                    frame = result[:frames][i]
                    frame = "#{frame[:file]}:#{frame[:line]}:in `#{frame[:name]}'"
                    # puts frame
                    #if frame.to_s =~ /iruby/ && !( frame.to_s =~ /IRuby::/ )
                    s = frame.to_s
                    if !( s =~ /application.rb/ ) &&
                            !( s =~ /Rake::Application/) &&
                            !( s =~ /task.rb/) &&
                            !( s =~ /kernel.rb/) &&
                            !( s =~ /profiler.rb/)
                        stack << frame.to_s
                    end
                    length -= 1
                    next
                end

                i.times do
                    stacks << stack.reverse
                end

                stack = []
                length = nil
            end
            stacks
        end
    end
end
