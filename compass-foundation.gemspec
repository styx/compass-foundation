# -*- encoding: utf-8 -*-
$:.push File.expand_path("../lib", __FILE__)
require "compass-foundation/version"

Gem::Specification.new do |s|
  s.name = %q{compass-foundation}
  s.version     = Compass::Foundation::VERSION

  s.required_rubygems_version = Gem::Requirement.new(">= 1.3.5")
  s.authors     = ["Mikhail S. Pobolovets"]
  s.date        = Time.now.strftime "%Y-%m-%d"
  s.summary     = %q{Foundation CSS framework for Rails via Compass.}
  s.description = %q{Plugin for compass to integrate with an easy to use, powerful, and flexible CSS framework for building prototypes and production code on any kind of device.}
  s.email       = %w{styx.mp@gmail.com}
  s.has_rdoc    = false

  s.files       = `git ls-files`.split("\n")
  s.test_files  = `git ls-files -- {test,spec,features}/*`.split("\n")
  s.executables = `git ls-files -- bin/*`.split("\n").map{ |f| File.basename(f) }

  s.homepage    = %q{http://foundation.zurb.com/}

  s.require_paths      = ["lib"]
  s.rubyforge_project  = %q{compass-foundation}
  s.rubygems_version   = %q{1.3.6}
  s.add_dependency(%q<compass>, [">= 0.10.0"])
end
