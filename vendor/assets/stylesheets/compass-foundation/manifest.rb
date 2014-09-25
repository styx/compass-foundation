# REdo (This outdated trash)
	# stylesheet 'compass_foundation.scss',  :media => 'screen, projection'
	# stylesheet '_forms.scss',              :media => 'screen, projection'
	# stylesheet '_globals.scss',            :media => 'screen, projection'
	# stylesheet '_ie.scss',                 :media => 'screen, projection'
	# stylesheet '_ui.scss',                 :media => 'screen, projection'
	# stylesheet '_typography.scss',         :media => 'screen, projection'
	# stylesheet '_reveal.scss',             :media => 'screen, projection'
	# stylesheet '_orbit.scss',              :media => 'screen, projection'
	# stylesheet '_compass_foundation.scss', :media => 'screen, projection'
	# stylesheet '_grid.scss',               :media => 'screen, projection'
	# stylesheet '_mobile.scss',             :media => 'screen, projection'
# UPDATE and add normalize
stylesheet 'normalize.scss',         		:media => 'screen, projection'
stylesheet 'foundation5.scss',         		:media => 'screen, projection'
stylesheet 'foundation/_settings.scss',		:media => 'screen, projection'
stylesheet 'foundation/_functions.scss',	:media => 'screen, projection'
stylesheet 'foundation/components/_global.scss',:media => 'screen, projection'
stylesheet 'foundation/components/_grid.scss',:media => 'screen, projection'
stylesheet 'foundation/components/_block-grid.scss',:media => 'screen, projection'
stylesheet 'foundation/components/_accordion.scss',:media => 'screen, projection'
stylesheet 'foundation/components/_alert-boxes.scss',:media => 'screen, projection'
stylesheet 'foundation/components/_breadcrumbs.scss',:media => 'screen, projection'
stylesheet 'foundation/components/_buttons.scss',:media => 'screen, projection'
stylesheet 'foundation/components/_split-buttons.scss',:media => 'screen, projection'
stylesheet 'foundation/components/_button-groups.scss',:media => 'screen, projection'
stylesheet 'foundation/components/_clearing.scss',:media => 'screen, projection'
stylesheet 'foundation/components/_dropdown.scss',:media => 'screen, projection'
stylesheet 'foundation/components/_dropdown-buttons.scss',:media => 'screen, projection'

stylesheet 'foundation/components/_top-bar.scss',:media => 'screen, projection'
stylesheet 'foundation/components/_offcanvas.scss',:media => 'screen, projection'
stylesheet 'foundation/components/_side-nav.scss',:media => 'screen, projection'
stylesheet 'foundation/components/_sub-nav.scss',:media => 'screen, projection'

stylesheet 'foundation/components/_flex-video.scss',:media => 'screen, projection'
stylesheet 'foundation/components/_forms.scss',:media => 'screen, projection'
stylesheet 'foundation/components/_icon-bar.scss',:media => 'screen, projection'
stylesheet 'foundation/components/_inline-lists.scss',:media => 'screen, projection'
stylesheet 'foundation/components/_joyride.scss',:media => 'screen, projection'
stylesheet 'foundation/components/_keystrokes.scss',:media => 'screen, projection'
stylesheet 'foundation/components/_labels.scss',:media => 'screen, projection'
stylesheet 'foundation/components/_magellan.scss',:media => 'screen, projection'

stylesheet 'foundation/components/_orbit.scss',:media => 'screen, projection'
stylesheet 'foundation/components/_pagination.scss',:media => 'screen, projection'
stylesheet 'foundation/components/_panels.scss',:media => 'screen, projection'
stylesheet 'foundation/components/_pricing-tables.scss',:media => 'screen, projection'
stylesheet 'foundation/components/_progress-bars.scss',:media => 'screen, projection'
stylesheet 'foundation/components/_range-slider.scss',:media => 'screen, projection'
stylesheet 'foundation/components/_reveal.scss',:media => 'screen, projection'
stylesheet 'foundation/components/_switches.scss',:media => 'screen, projection'
stylesheet 'foundation/components/_tables.scss',:media => 'screen, projection'
stylesheet 'foundation/components/_tabs.scss',:media => 'screen, projection'
stylesheet 'foundation/components/_thumbs.scss',:media => 'screen, projection'
stylesheet 'foundation/components/_toolbar.scss',:media => 'screen, projection'
stylesheet 'foundation/components/_tooltips.scss',:media => 'screen, projection'
stylesheet 'foundation/components/_type.scss',:media => 'screen, projection'
stylesheet 'foundation/components/_visibility.scss',:media => 'screen, projection'

# Prints the following error but
	# Errno::ENOENT on line ["95"] of C: No such file or directory - C:/Ruby200-x64/li
	# b/ruby/gems/2.0.0/gems/compass-foundation-0.1.1/lib/../vendor/assets/stylesheets
	# /compass-foundation/stylesheet/foundation.scss
# stylesheet 'stylesheet/foundation.scss',     :to => 'foundation.scss'

# NEW
	javascript '../../javascripts/foundation.abide.js',           :to => 'foundation.abide.js'
	javascript '../../javascripts/foundation.accordion.js',       :to => 'foundation.accordion.js'
	javascript '../../javascripts/foundation.alert.js',     	  :to => 'foundation.alert.js'
	javascript '../../javascripts/foundation.clearing.js', 		  :to => 'foundation.clearing.js'
	javascript '../../javascripts/foundation.orbit.js',           :to => 'foundation.orbit.js'
	javascript '../../javascripts/foundation.dropdown.js',        :to => 'foundation.dropdown.js'
	javascript '../../javascripts/foundation.equalizer.js',       :to => 'foundation.equalizer.js'
	javascript '../../javascripts/foundation.interchange.js',     :to => 'foundation.interchange.js'
	javascript '../../javascripts/foundation.joyride.js', 		  :to => 'foundation.joyride.js'
	javascript '../../javascripts/foundation.magellan.js',        :to => 'foundation.magellan.js'
	javascript '../../javascripts/foundation.topbar.js',          :to => 'foundation.topbar.js'
	javascript '../../javascripts/foundation.offcanvas.js',       :to => 'foundation.offcanvas.js'
	javascript '../../javascripts/foundation.reveal.js',       	  :to => 'foundation.reveal.js'
	javascript '../../javascripts/foundation.slider.js',     	  :to => 'foundation.slider.js'
	javascript '../../javascripts/foundation.tab.js', 		      :to => 'foundation.tab.js'
	javascript '../../javascripts/foundation.tooltip.js',         :to => 'foundation.tooltip.js'
	#final
	javascript '../../javascripts/foundation.js',                 :to => 'foundation.js'

	#Vendor
	javascript '../../javascripts/vendor/jquery.js',            :to => 'vendor/jquery.js'
	javascript '../../javascripts/vendor/jquery.cookie.js',		:to => 'vendor/jquery.cookie.js'
	javascript '../../javascripts/vendor/fastclick.js',         :to => 'vendor/fastclick.js'
	javascript '../../javascripts/vendor/modernizr.js',         :to => 'vendor/modernizr.js'
	javascript '../../javascripts/vendor/placeholder.js',       :to => 'vendor/placeholder.js'
	# Some extra magic ;-)
	javascript '../../javascripts/vendor/bg-video.js',       :to => 'vendor/bg-video.js'


image '../../images/misc/button-gloss.png',        :to => 'button-gloss.png'
image '../../images/misc/button-overlay.png',      :to => 'button-overlay.png'
image '../../images/misc/custom-form-sprites.png', :to => 'custom-form-sprites.png'
image '../../images/misc/input-bg.png',            :to => 'input-bg.png'
image '../../images/misc/modal-gloss.png',         :to => 'modal-gloss.png'
image '../../images/misc/table-sorter.png',        :to => 'table-sorter.png'

image '../../images/orbit/bullets.jpg',            :to => 'bullets.jpg'
image '../../images/orbit/left-arrow.png',         :to => 'left-arrow.png'
image '../../images/orbit/loading.gif',            :to => 'loading.gif'
image '../../images/orbit/mask-black.png',         :to => 'mask-black.png'
image '../../images/orbit/pause-black.png',        :to => 'pause-black.png'
image '../../images/orbit/right-arrow.png',        :to => 'right-arrow.png'
image '../../images/orbit/rotator-black.png',      :to => 'rotator-black.png'
image '../../images/orbit/timer-black.png',        :to => 'timer-black.png'

# new folders
# fonts '../../fonts/foundation-icons.eot',	:to => 'foundation-icons.eot'
# templates '../../foundation-icons.eot',	:to => 'foundation-icons.eot'

description "SCSS port of Foundation CSS framework"
