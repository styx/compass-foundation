require 'compass'
Compass::Frameworks.register("foundation", :path => "#{File.dirname(__FILE__)}/..")


require 'compass'
require "compass-foundation/rails"
require "compass-foundation/version"

plugin_root = File.join(File.dirname(__FILE__), "..")

Compass::Frameworks.register("compass-foundation",
                            :stylesheets_directory => File.join(plugin_root, "stylesheets"),
                            :templates_directory => File.join(plugin_root, "vendor/assets/stylesheets"))

