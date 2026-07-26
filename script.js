
// Target DOM elements
const gallery = document.querySelector(".gallery");
const artistDD = document.querySelector("#artDD");
const artImg = document.querySelector(".artImg");
const artist = document.querySelector(".artist");
const artTitle = document.querySelector(".artTitle");
const artDate = document.querySelector(".artDate");
const artDesc = document.querySelector(".artDesc");
const error = document.querySelector(".error");

// Listen for events
artistDD.addEventListener("change", (e) => {
  e.preventDefault();                                 // PREVENT THE FORM FROM REFRESHING   

  //If the user selects a dropdown item, erase the existing artwork and get the enw Data
  if (artistDD.value !== "error") {
    error.style.display = "none";
    gallery.innerHTML="";
    error.innerHTML = "";  
    getArtData(artistDD.value);
  } else {
    // Show error message to user
    error.innerHTML = `<h4>No Selection Made. Please select an artist.</h4>`;  
    error.style.display = "block";   
    gallery.innerHTML=
    `  <div class="artRow">                                         
          <div class="imageContainer">                                 
            <img class="artImg" src="images/generic_cubist_img.png"/>    
          </div>                        
          <div class="artData">
            <h3 class="artist">Artist: Artist Name</h3>
            <h4 class="artTitle">Title: Artwork</h4>            
            <p class="artDate"><span class="artLabel">Date:</span> 12/12/1912</p>            
            <p class="artDesc"><span class="artLabel">More Details:</span><span style="color:rgb(155, 0, 0)">Please select an artist to populate this area.</span></p>
          </div>
        </div>             
        `;  
  }            
   
});

/*  This function builds the HTML to display the rows of art work and relevant data  */
function getArtDetails(response) {
  let html = `  
    <div class="artRow">
      <div class="imageContainer">                                
        <img class="artImg" src="${response.primaryImageSmall}"/>
      </div>                        
      <div class="artData">
        <h3 class="artist">Artist: ${response.artistDisplayName}</h4>
        <h4 class="artTitle">Title: ${response.title}</h3>            
        <p class="artDate"><span class="artLabel">Date: </span>${response.objectDate}</p>            
        <p class="artDesc"><span class="artLabel">More Details: </span><a href="${response.objectURL}" target="_blank" rel="noopener noreferrer">View on the Met's website (opens in new tab)</a></p>
      </div>
    </div>
  `;

  let newDiv = document.querySelector(".gallery");
  newDiv.insertAdjacentHTML("beforeend", html);  
}

/* This function places two asynchronous calls to the API.  
 * The first call fetches the object numbers relevent to the the artist selected.
 * The second call uses the object numbers to collect information about each art object
 * and then calls the getArtDetails function to build the HTML to display the rows
 * of artwork.  
 * NOTE: I have chosen to limit the artwork displayed to 9 items.
 */
async function getArtData(search) {
  // Fetch the artist ID
  let response = await fetch(
    `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${search}`
  )
    .then((response) => {
      return response.json();
    })
    .then((response) => {      
      // loop thru the response object Id's and use the ID's to get the art work Objects
      
      for (let i = 0; i < response.objectIDs.length  && i <=8; i++) {       
        //Fetch the artwork by the artist.        
        let fetchURL = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${response.objectIDs[i]}`;
        fetch(fetchURL) // get the artwork object
          .then((response) => {
            return response.json(); // convert the object to json
          })
          .then((response) => {
            
            //If the object contains a small painting & is not blank or undefined build the HTML   
            if( response.artistDisplayName.includes(search)  )   {
              if ( typeof(response.primaryImageSmall) !== 'undefined') { 
                if( response.primaryImageSmall !== "" ) {
                  getArtDetails(response);
                }
              }   
            }         
          })
          .catch((err) => {
            error.innerHTML= `${err}`;   
        });          
      }
    });  
}





