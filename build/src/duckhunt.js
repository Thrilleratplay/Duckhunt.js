function duckhunt(){
	var bullets=3, 
	frameTimeout=100,			// the number of animation cycles that occur before the ducks fly away
	duckWidth=145, 				// px
	duckHeight=145, 			// px
	sprite=[0,-145,-290], 		// first,second,third animation frame
	orientation=[0,-145,-290];  // horizontal,diaginally,vertially duck orientation

	// outer overlay
	var overlayOuter=document.body.appendChild(document.createElement('div'));
	overlayOuter.className="duckhunt_overlay";
	// inner overlay
	var overlay=overlayOuter.appendChild(document.createElement('div'));
	overlay.className="duckhunt_overlay";
	overlay.onclick=shotFlash;

	// duck objects
	var duck1=new Object({
		e:overlay.appendChild(document.createElement('div')),
		spriteNum:0,
		orientationNum:1,
		slopeX:randomSlope(),
		slopeY:0,
		shot:false,		
		finished:false,
		topOffset:overlay.offsetHeight,
		leftOffset:randomLeftOffset()
	}),
	duck2=new Object({
		e:overlay.appendChild(document.createElement('div')),
		spriteNum:0,
		orientationNum:0,
		slopeX:-randomSlope(),
		slopeY:0,
		shot:false,
		finished:false,
		topOffset:overlay.offsetHeight,
		leftOffset:randomLeftOffset()
	});
	
	// ids
	duck1.e.id="duck1";
	duck2.e.id="duck2";

	// classes
	duck1.e.className = "duckhunt_sprites duckhunt_duck";
	duck2.e.className = "duckhunt_sprites duckhunt_duck duckhunt_hoz_flip";
	
	//bind duckShot() to onclick event
	duck1.e.onclick=duckShot;
	duck2.e.onclick=duckShot;

	//start animation
	duckFlapFrame(duck1,1);
	duckFlapFrame(duck2,1);	


	/**
	 * Updates the animation frame and determines if fly away sequence 
	 * shouble begin
	 * 
	 * @param {Object} duck
	 * @param {Number} frameNum
	 */
	function duckFlapFrame(duck,frameNum){
		//Has this duck not been shot and the timeout has been reached 
		//or are there no more bullets? 
		if(!duck.shot&&(frameNum>frameTimeout||bullets<=0)){
			//fly away
			duck.orientationNum=2;
			duckFlyawayFrame(duck);
		}else if (!duck.shot&&frameNum<=frameTimeout){
			// When hitting the edge of the screen, the duck should 
			// reverse directionand at random but natural slope 

			//right side of screen
			if(duck.leftOffset>=(overlay.offsetWidth-duckWidth)){
				duck.e.className ="duckhunt_sprites duckhunt_duck duckhunt_hoz_flip";
				duck.slopeX=-randomSlope();
			}
			//left side of screen
			else if (duck.leftOffset<=0){
				duck.e.className = "duckhunt_sprites duckhunt_duck";
				duck.slopeX=randomSlope();
			}
			//top
			if(duck.topOffset<=0){ 
				duck.slopeY=randomSlope();
				duck.orientationNum=((duck.slopeX/duck.slopeY)<1.03)?0:1;
			}
			//bottom
			else if(duck.topOffset>=(overlay.offsetHeight-duckHeight)){ 
				duck.slopeY=-randomSlope();
				duck.orientationNum=((duck.slopeX/duck.slopeY)<1.03)?0:1;
			}
		
			// update position
			duck.topOffset+=(duck.slopeY*8);
			duck.leftOffset+=(duck.slopeX*8);
			duck.e.style.top=duck.topOffset+"px";
			duck.e.style.left=duck.leftOffset+"px";

			// update sprite
			duck.spriteNum=((duck.spriteNum==2)?0:duck.spriteNum+1);
			duck.e.style.backgroundPosition=sprite[duck.spriteNum]+"px "+orientation[duck.orientationNum]+"px";
			
			// lather, rinse, repeat
			setTimeout(function() { duckFlapFrame(duck,frameNum+1);},50);
		}
	}


	/**
	* Fly away animation sequence that will continue to the dog animation 
	* when complete
	* 
	* @param {Object} duck
	*/
	function duckFlyawayFrame(duck){
		// update position
		duck.topOffset-=15;
		duck.e.style.top=duck.topOffset+"px";

		// update sprite
		duck.spriteNum=((duck.spriteNum==2)?0:duck.spriteNum+1);
		duck.e.style.backgroundPosition=sprite[duck.spriteNum]+"px "+orientation[duck.orientationNum]+"px";

		// If the duck has not reached the top of the screen
		if(duck.topOffset>-duckHeight){
			// lather, rinse, repeat
			setTimeout(function() { duckFlyawayFrame(duck);},50);
		}else{
			// Woof
			duck.finished=true;
			dogStart();
		}
	}


	/**
	* Verify duck can be shot and show sprite that briefly appears 
	* between flash and the diving sequence
	*/
	function duckShot(){
		var duck=(this.id=="duck1")?duck1:duck2;
		
		// If there bullets and duck is not flying away
		if(bullets>0&&duck.orientationNum!=2){
			duck.shot=true;
			// duck shot 
			duck.e.style.backgroundPosition="-435px -145px";
			setTimeout(
				function() { 
					duck.e.style.backgroundPosition="-435px -290px";			
					duckShotFrame(duck,false);
				},400);
		}
		return false;
	}
	
	
	/**
	 * The diving animation sequence after a duck has been shot and will 
	 * continue to the dog animation when complete
	 * @param {Number} duck
	 * @param {Boolean} flip
	 */
	function duckShotFrame(duck,flip){
		duck.e.className =flip?"duckhunt_sprites duckhunt_duck duckhunt_hoz_flip":"duckhunt_sprites duckhunt_duck";
		duck.topOffset+=30;
		duck.e.style.top=(duck.topOffset)+"px";
		
		// If the top of the duck sprite has not reached the bottom of the overlay
		if(duck.topOffset<(overlay.offsetHeight+duckHeight)){
			// lather, rinse, repeat
			setTimeout(function(){ 
				duckShotFrame(duck,!flip); 
			} ,50);
		}else{
			// Woof
			duck.finished=true;
			dogStart();
		}
	}


	/**
	* Based on out come, choose the  appropriate dog sprite for the animation
	*/
	function dogStart(){
		// Verifiy both ducks have either been shot or flown away
		if(duck1.finished&&duck2.finished){
			// Add dog to overlay
			var dog=overlay.appendChild(document.createElement('div'));

			dog.style.top=overlay.offsetHeight+duckHeight+"px";
			dog.className ="duckhunt_sprites duckhunt_dog";
			
			if(duck1.shot&&duck2.shot){
				// If both ducks had been shot
				dog.style.backgroundPosition="0px -435px";
				dog.style.width="250px"; 
			}else if(duck1.shot||duck2.shot){
				// If one duck was shot
				dog.style.backgroundPosition="-250px -435px";
				dog.style.width="200px"; 
			}else{
				// If the dog needs to mock some one
				dog.style.backgroundPosition="-450px -435px";
				dog.style.width="150px"; 
			}
			dog.style.top=(overlay.offsetHeight)+"px";
			
			// Begin animation
			dogFrame(dog,true);	
		}
	}
	
	
	/**
	* Dog animation
	* 
	* @param {Object} dog
	* @param {Boolean} goingUp
	*/
	function dogFrame(dog,goingUp){
		var dogPixelsDisplayed=overlay.offsetHeight-parseInt(dog.style.top);
		
		if(dogPixelsDisplayed<160&&goingUp){
			// if the height of the dog displayed is less tham the total
			// height of the dog and the dog is going up, then subtract 
			// from the top offset lather, rinse, repeat
			dog.style.top=(parseInt(dog.style.top)-20)+"px";
			setTimeout(function() { dogFrame(dog,goingUp); },60);
		}else if(dogPixelsDisplayed>0&&!goingUp){
			// if the dog is going down and some is still being displayed
			// add to the top offset lather, rinse, repeat
			dog.style.top=(parseInt(dog.style.top)+20)+"px";
			setTimeout(function() { dogFrame(dog,goingUp); },60);
		}else if(dogPixelsDisplayed>=160 && dog.style.backgroundPosition=="-450px -435px"){
			// if the entire dog is being displayed, laugh before reversing
			dogLaughing(dog,8);
			
		}else if(dogPixelsDisplayed>=160){
			// if the entire dog is being displayed, pause before reversing
			setTimeout(function() { dogFrame(dog,!goingUp); },1000);
		}else{
			// when complete, remove the evidence before the cops get here
			document.body.removeChild(overlayOuter);
		}
	}


	/**
	 * Dog laughing animation
	 * 
	 * @param {Object} dog
	 * @param {Number} frames frames left to be mocked
	 */
	function dogLaughing(dog,framesLeft){
		if(framesLeft>0){
			dog.style.backgroundPosition=(dog.style.backgroundPosition=="-450px -435px")?"-600px -435px":"-450px -435px";
			setTimeout(function() { dogLaughing(dog,framesLeft-1) },110);
		}else{
			dogFrame(dog,false);
		}
	}
	
	
	/**
	* Deducts bullets and does flash over effect.
	*/
	function shotFlash(){
		// Ensure there are bullets 
		if(bullets>0){
			var duck1Classes=duck1.e.className,
			duck2Classes=duck2.e.className;

			// deduct bullets
			bullets--;	

			overlayOuter.style.backgroundColor="rgb(0, 0, 0)";
			overlay.style.backgroundColor="rgb(0, 0, 0)";
			duck1.e.style.backgroundColor="rgb(255, 255, 255)";
			duck2.e.style.backgroundColor="rgb(255, 255, 255)";
			duck1.e.style.backgroundImage="none";
			duck2.e.style.backgroundImage="none";
			setTimeout(function() { 
				overlayOuter.style.backgroundColor="";
				overlay.style.backgroundColor="";
				duck1.e.style.backgroundColor=null;
				duck2.e.style.backgroundColor=null;
				duck1.e.style.backgroundImage=null;
				duck2.e.style.backgroundImage=null;
				duck1.e.className=duck1Classes;
				duck2.e.className=duck2Classes;
			},100);
		}	
	}
	

	/**
	* Random point within 80% of window width.  10% on either side for padding
	* 
	* @returns {Number}
	*/
	function randomLeftOffset(){
		return Math.round(Math.random()*overlay.offsetWidth*0.8)+(overlay.offsetWidth*0.1);
	}

	/**
	* Generate a random slope
	* 
	* @returns {Number}
	*/
	function randomSlope(){
		return Math.atan(Math.random()*90);
	}
};
