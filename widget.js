let lastJokeID = null;

let reveal_event = BWProperties.namespace + '_reveal_answer';

let reveal_id = '#'+ BWProperties.namespace + '_reveals';

function sendJoke() {
  	 //See API: https://sv443.net/jokeapi/v2/
     let url = 'https://v2.jokeapi.dev/joke/Any?type=twopart';
  
     let exclude_explicit = $('#_oZ07r_clean_only').is(":checked");
  
     if(exclude_explicit) {
        url += '&blacklistFlags=explicit'; 
     }
  
	fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      
      let position = $('#' +BWProperties.namespace +'_position').find(":selected").val();
      
      let content = `
        <div class="text-center">
          <div id="setup-{{overlay_id}}">
              <h3>${data.setup}</h3>
          </div>
          <div>
              <button class="btn btn-info" onclick="${BWProperties.namespace}.revealAnswer('{{overlay_id}}')">Reveal Answer</button>
          <div>
          <div id="delivery-{{overlay_id}}" class="delivery-answer" style="display:none;">
              ${data.delivery} <i class="fas fa-grin-squint-tears"></i>
          </div>
        </div> 
    `;
      
     let params = {content : content,onscreen_timer	: true, position : position, execute_javascript: BWProperties.namespace + '.removeLastJoke("{{overlay_id}}")'};
     
      BWAPI.post('/events/' + BWProperties['event_id'] + '/sendOnscreenContent', params).then(response => {
        
        	if(response.status == 'success') {
             	$(reveal_id).html('');
            }
       });
      
    });
  
}

function revealAnswer(overlay_id) {
  
    let element= document.getElementById('delivery-'+overlay_id);
  
    if(element) {
     	element.style="display: block;" 
    }
  
  	BWEvents.publish(reveal_event, {user : BWProperties.user.account} );
  
}

function removeLastJoke(overlay_id) {
   
    if(lastJokeID) {
         	$('#'+lastJokeID).remove();
     }
  
  lastJokeID = overlay_id;
  
}

BWEvents.subscribe(reveal_event, 'listener_1', (response) => {
       
       $(reveal_id).append(`<p>${response.user.first_name} ${response.user.last_name} revealed the answer.</p>`);
 })

this.sendJoke= sendJoke;

this.revealAnswer = revealAnswer;

this.removeLastJoke = removeLastJoke;
  
