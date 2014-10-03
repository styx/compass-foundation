/* Jarallax
	================================================== */
	
init = function() {
	var jarallax = new Jarallax();
	
	//Default
	jarallax.setDefault('#slide1', { position: 'fixed', height: '500px', left: '50%', marginLeft: '-960px'});
	jarallax.setDefault('#slide2, #slide3, #slide4', { position: 'fixed', height: '1000px', left: '50%', marginLeft: '-960px'});
	
	jarallax.addAnimation('#slide1',
								[{ progress: '0%', top: '0px'},
								 { progress: '100%', top: '-1000px'}]);
		
	jarallax.addAnimation('#slide2',
							[{ progress: '0%', top: '500px'},
							 { progress: '15%', top: '200px'},
							 { progress: '25%', top: '0px'},
							 { progress: '70%', top: '-900px'},
							 { progress: '100%', top: '-1500px'}]);

	jarallax.addAnimation('#slide3',
							[{ progress: '0%', top: '1500px'},
							 { progress: '25%', top: '1350px'},
							 { progress: '50%', top: '0px'},
							 { progress: '70%', top: '-850px'},
							 { progress: '100%', top: '-1500px'}]);
							 
	jarallax.addAnimation('#slide4',
							[{ progress: '0%', top: '2500px'},
							 { progress: '40%', top: '1500px'},
							 { progress: '50%', top: '0px'},
							 { progress: '70%', top: '0px'},
							 { progress: '100%', top: '-300px'}]);
							 
	
   if( $(window).height()<500 ){
          
       jarallax.addAnimation('#slide4',
       						[{ progress: '0%', top: '2500px'},
       						 { progress: '40%', top: '1500px'},
       						 { progress: '50%', top: '0px'},
       						 { progress: '70%', top: '0px'},
       						 { progress: '100%', top: '-500px'}]);   
          
   }
   if( $(window).height()>900 ) {
   	
	   jarallax.addAnimation('#slide4',
	   							[{ progress: '0%', top: '2500px'},
	   							 { progress: '40%', top: '1500px'},
	   							 { progress: '50%', top: '0px'},
	   							 { progress: '70%', top: '0px'},
	   							 { progress: '100%', top: '0px'}]);  
   	
   }					 					 
	
	//Slide 1 - Objetos
	jarallax.addAnimation('#bienvenida',
							[{ progress: '0%', top: '90px', opacity: '1'},
							 { progress: '30%', top: '150px', opacity: '0'},
							 { progress: '100%', top: '0px', opacity: '0'}]);
	
	jarallax.addAnimation('#logo',
							[{ progress: '0%', top: '160px'},
							 { progress: '30%', top: '400px'},
							 { progress: '100%', top: '0px', opacity: '0'}]);
	
	//Slide 2 - Objetos
	jarallax.setDefault('#servicio1, #servicio2, #servicio3, #servicio4', { top: '200px', opacity: '.1' });
	jarallax.addAnimation('#servicio1',
							[{ progress: '0%', top: '200px', opacity: '.1'},
							 { progress: '25%', top: '200px', opacity: '1'},
							 { progress: '50%', top: '170px', opacity: '1'},
							 { progress: '65%', top: '450px', opacity: '0'},
							 { progress: '100%', top: '400px', opacity: '0'}]);
	jarallax.addAnimation('#servicio2',
							[{ progress: '0%', top: '200px', opacity: '.1'},
							 { progress: '25%', top: '200px', opacity: '1'},
							 { progress: '50%', top: '200px', opacity: '1'},
							 { progress: '65%', top: '400px', opacity: '0'},
							 { progress: '100%', top: '400px', opacity: '0'}]);
	jarallax.addAnimation('#servicio3',
							[{ progress: '0%', top: '200px', opacity: '.1'},
							 { progress: '25%', top: '200px', opacity: '1'},
							 { progress: '50%', top: '150px', opacity: '1'},
							 { progress: '65%', top: '470px', opacity: '0'},
							 { progress: '100%', top: '400px', opacity: '0'}]);
	jarallax.addAnimation('#servicio4',
							[{ progress: '0%', top: '200px', opacity: '.1'},
							 { progress: '25%', top: '200px', opacity: '1'},
							 { progress: '50%', top: '200px', opacity: '1'},
							 { progress: '65%', top: '400px', opacity: '0'},
							 { progress: '100%', top: '400px', opacity: '0'}]);
	
	
	jarallax.setDefault('#servicio-txt1, #servicio-txt2', { top: '500px', opacity: '0'});
	jarallax.addAnimation('#servicio-txt1',
							[{ progress: '0%', top: '500px', opacity: '0'},
							 { progress: '30%', top: '500px', opacity: '1'},
							 { progress: '45%', top: '500px', opacity: '1'},
							 { progress: '50%', top: '550px', opacity: '1'},
							 { progress: '52%', top: '500px', opacity: '0'},
							 { progress: '100%', top: '600px', opacity: '0'}]);
	jarallax.addAnimation('#servicio-txt2',
							[{ progress: '0%', top: '500px', opacity: '0'},
							 { progress: '30%', top: '500px', opacity: '1'},
							 { progress: '45%', top: '500px', opacity: '1'},
							 { progress: '50%', top: '550px', opacity: '1'},
							 { progress: '52%', top: '500px', opacity: '0'},
							 { progress: '100%', top: '600px', opacity: '0'}]);			 			 
	
	//Slide 3 - Objetos
	jarallax.addAnimation('#corona',
							[{ progress: '0%', top: '-500px', opacity: '.1'},
							 { progress: '50%', top: '0px', opacity: '1'},
							 { progress: '80%', top: '800px', opacity: '.1'}]);
	
	jarallax.setDefault('#nosotros-txt1, #nosotros-txt2, #nosotros-txt3', { top: '200px', opacity: '0' });
	jarallax.addAnimation('#nosotros-txt1, #nosotros-txt2, #nosotros-txt3',
							[{ progress: '0%', top: '200px', opacity: '0'},
							 { progress: '15%', top: '200px', opacity: '1'},
							 { progress: '55%', top: '250px', opacity: '1'},
							 { progress: '70%', top: '550px', opacity: '1'},
							 { progress: '100%', top: '0px', opacity: '0'}]);
	
	//Slide 4 - Objetos
	
	jarallax.setDefault('#contact1, #contact2', { left: '500px', opacity: '0' });
	jarallax.addAnimation('#contact1',
							[{ progress: '0%', left: '500px', opacity: '0'},
							 { progress: '60%', left: '500px', opacity: '1'},
							 { progress: '70%', left: '0px', opacity: '1', style:{easing:'easeInOut',power:5}},
							 { progress: '100%', left: '0px', opacity: '1'}]);						 
	jarallax.addAnimation('#contact2',
							[{ progress: '0%', left: '500px', opacity: '0'},
							 { progress: '62%', left: '500px', opacity: '1'},
							 { progress: '72%', left: '0px', opacity: '1', style:{easing:'easeInOut',power:5}},
							 { progress: '100%', left: '0px', opacity: '1'}]);
	
	jarallax.addAnimation('#contactform',
							[{ progress: '0%', top: '150px'},
							 { progress: '63%', top: '150px'},
							 { progress: '69%', top: '200px'},
							 { progress: '100%', top: '200px'}]);
	jarallax.addAnimation('#send',
							[{ progress: '0%', top: '550px'},
							 { progress: '60%', top: '550px'},
							 { progress: '70%', top: '690px', style:{easing:'easeInOut',power:9}},
							 { progress: '100%', top: '690px'}]);						 
							 
							 							 	 								 
}