/*
* Awesome HBO NOW (AHN)
*/

var AHN = {
  //asset can either be a movie or tv show
  assetSelector: '.now-thumbnail',
  assetOverlaySelector: '.now-thumbnail-overlay',
  omdbApi: 'https://www.omdbapi.com/?plot=short&r=json&t=',
  init: function() {
    this.extractAssetData();
  },
  extractAssetData: function() {
    var assetContainers = document.querySelectorAll(this.assetSelector);
    [].forEach.call(assetContainers, (el) => {

      //let's get all the data attributes on el, specifically data-asset
      var assetData = JSON.parse(el.dataset.asset);

      /*
      * Sometimes HBO does not give us all the info we need in that case
      * we will get the it from OMDB api. For example HBO does not give as series synopsis
      * on "/series"
      */
      if(assetData.description === undefined || window.location.pathname === "/series") {
        this.makeApiRequest(assetData.title, (data) => {
          if(data.Plot != undefined) {
            assetData.description = data.Plot;
            //ahnInfoNode is the overlay node that will display the data
            var ahnInfoNode = this.createAHNInfo(assetData);
            //we are appending it to the parent node's overlay, the overlay shows on mouse hover
            this.appendToOverlay(ahnInfoNode, el);
          }
        });
      }
      /*
      * But if we have all the data we need we will go ahead and build the info node
      */
      else {
        //ahnInfoNode is the overlay node that will display the data
        var ahnInfoNode = this.createAHNInfo(assetData);
        //we are appending it to the parent node's overlay, the overlay shows on mouse hover
        this.appendToOverlay(ahnInfoNode, el);
      }

    });
  },
  appendToOverlay: function(ahnInfoNode, el) {
    el.appendChild(ahnInfoNode);
  },
  createAHNInfo: function(assetData) {
   let ahnInfoHTML = `<div class="ahn-info" data-year="${assetData.releaseDate}">
      <p class="plot">
        ${assetData.description}
      </p>
      <span class="ahn-rating">
        <span>Rating: </span>
        ${assetData.rating}
    </div> `;
    let ahnInfoNode = document.createElement('div');
    ahnInfoNode.innerHTML = ahnInfoHTML;
    return ahnInfoNode.firstChild;
  },
  makeApiRequest: function(title, cb) {
    var xhr = new XMLHttpRequest();
    var url = this.omdbApi + title;
    xhr.open('GET', url);
    xhr.send();
    xhr.onload = function() {
      if(xhr.status === 200) {
        var data = JSON.parse(xhr.response);
        cb(data);
      }
    }
  }
};

window.onload  = () => {
  AHN.init();
};
