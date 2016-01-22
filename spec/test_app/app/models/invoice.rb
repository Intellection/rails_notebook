class Invoice < ActiveRecord::Base
  belongs_to :order
  belongs_to :customer
end
