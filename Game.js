class Game {
  constructor(){

  }

  getState(){
    var gameStateRef  = database.ref('gameState');
    gameStateRef.on("value",function(data){
       gameState = data.val();
    })

  }

  update(state){
    database.ref('/').update({
      gameState: state
    });
  }

  async start(){
    if(gameState === 0){
      player = new Player();
      var playerCountRef = await database.ref('playerCount').once("value");
      if(playerCountRef.exists()){
        playerCount = playerCountRef.val();
        player.getCount();
      }
      form = new Form()
      form.display();
    }

    car1 = createSprite(100,400);
    car1.scale = 1.5;
    car1.addImage("car1",car1_img);
    car2 = createSprite(300,200);
    car2.scale = 1.5;
    car2.addImage("car2",car2_img);
    cars = [car1, car2];

    blocker1 = createSprite(685,400,70,70);
    blocker1.scale = 0.45;
    blocker1.addImage("blocker1",blockerIMG)
    blocker2 = createSprite(1245,18900,50,50);
    blocker2.scale = 0.45;
    blocker2.addImage("blocker2",blockerIMG);
  }

  play(){
    form.hide();
    
    Player.getPlayerInfo();
    player.getCarsAtEnd();
    //console.log(allPlayers);

    if(allPlayers !== undefined){
      background(rgb(198,135,103));
      image(track, 0,-displayHeight*3.5,displayWidth, displayHeight*25);
      
      //var display_position = 100;
      
      //index of the array
      var index = 0;

      //x and y position of the cars
      var x = 125;
      var y;
      for(var plr in allPlayers){
        //add 1 to the index for every loop
        index = index + 1 ;

        //position the cars a little away from each other in x direction
        x = x + 560;
        //use data form the database to display the cars in y direction
        y = displayHeight * 17.5 - allPlayers[plr].distance;
        console.log(cars[index - 1].y);
        cars[index-1].x = x;
        cars[index-1].y = y;
        // console.log(index, player.index)

        if (index === player.index){
          stroke(10);
          fill("red");
          ellipse(x,y,60,60);
          cars[index - 1].shapeColor = "red";
          camera.position.x = displayWidth/2;
          camera.position.y = cars[index-1].y;
        }
       
        //textSize(15);
        //text(allPlayers[plr].name + ": " + allPlayers[plr].distance, 120,display_position)
      }
    }

    if(keyIsDown(UP_ARROW) && player.index !== null){
      player.distance +=30
      player.update();
    }
    if(keyIsDown(DOWN_ARROW) && player.index !== null){
      player.distance -=30
      player.update();
    }
    if(keyDown(RIGHT_ARROW) && player.index !== null){
      cars[index - 1].x +=30
      player.update();
    }
    if(keyDown(LEFT_ARROW) && player.index !== null){
      cars[index - 1].x -=30
      player.update();
    }

    if(player.distance > 6000){
      gameState = 2;
      player.rank +=1
      Player.updateCarsAtEnd(player.rank)
    }
   
    drawSprites();
  }

  end(){
    console.log("Game Ended");
    console.log(player.rank);
  }
}

/*{ "rules": { ".read": "true", // 2020-11-13 
  ".write": "true", // 2020-11-13 
           }
 }*/