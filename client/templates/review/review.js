var clickedTopic = {};
var currentCard;
var currentList = [];

Template.review.helpers({
  //displays card question and answer
  card : function(arg){
    $('.answerblock').append('<p class="answer"><b>'+arg.answer+'</b></p>');
    $('.answer').after('<br><p class="answer">rate your difficulty with the question</p><button class="difficulty">easy</button><button class="difficulty">hard</button>');
    $('.button').remove();
  },
  //pulls card from list and displays the question
  //sends card to back of the list
  displayQuestion : function(){
    if(currentList.length){
      $('.question').html('');
      var cardId = currentList.shift();
      currentCard = Cards.find({_id: cardId}).fetch();
      currentCard = currentCard[0];
      $('.question').append(currentCard.question);
      currentList.push(cardId);
    }
  },
  //creates an array of all topics under review and 
  //calls the display question function
  topicQueue : function(){
    currentList = [];
    for(var prop in clickedTopic){
      var cardList = Topics.find({name: prop}).fetch(); 
      cardList = cardList[0];
      if(cardList){
        currentList = currentList.concat(cardList.cards);
      }  
    }

    Template.review.displayQuestion();
  },
  //displays lists of topics available from the topics collection
  topicList : function(){
  var topics = Topics.find().fetch();
  return topics;
  },
  //handles adding and removing topics for review from two sources
  clickEventHandler : function(context){
    context.name = context.name || context.innerHTML;
    var name = context.name.toLowerCase().split(' ').join('');
    if(!clickedTopic[context.name]){
      clickedTopic[context.name] = name;
      $('.selectedTopics').append('<li id="'+name+'"><a href="#">'+context.name+'</a></li>');
      Template.review.topicQueue();
    }else{
      $('#'+name).remove();
      delete clickedTopic[context.name];
      if(Object.keys(clickedTopic).length === 0){
        $('.question').html('');
      }
      Template.review.topicQueue();
    }
  }
});
//click event that lists topics being reviewed
Template.review.events({
  //populates and removes review topics 
  'click #topics li': function(){
    Template.review.clickEventHandler(this);
  },
  //click event that registers the click on the difficulty buttons
  'click .difficulty': function(){
    //display the next question
    $('.question').html('');
    $('.answerblock').html('');
    Template.review.displayQuestion();
    $('.question').after('<button class="button">click to see answer</button>');
  },
  //button to reveal answer
  'click .button': function(){
    if(currentList.length > 0){
      Template.review.card(currentCard);
    }
  },
  //deselects topics for review
  'click .selectedTopics li': function(e){
    Template.review.clickEventHandler(e.currentTarget.children[0]);
  }
});