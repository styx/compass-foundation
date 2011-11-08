module CompassFoundation
    module Rails
        if defined? ::Rails and ::Rails.version >= '3.1'
            require 'compass-foundation/rails/engine'
        end
    end
end
